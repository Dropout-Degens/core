import { User } from "@prisma/client";
import db from "../db";
import { recalcMetadata } from "../discord/application-metadata";
import { FindUniqueReturn, WithSnowflake } from "../index";

type DBUser = FindUniqueReturn<WithSnowflake<{include: {memberships: true}}>>;

export async function flattenMemberships<T extends {memberships: (Pick<DBUser['memberships'][number], 'active'|'backendId'|'positiveFlags'|'negativeFlags'> & Partial<DBUser['memberships'][number]>)[]} & Omit<Partial<DBUser>, 'memberships'> & Pick<DBUser, 'subscriptionType'>>(user: T, alwaysRefreshDiscordMetadata = false): Promise<T & Pick<DBUser, 'subscriptionType'>> {
    let positiveFlags: number = 0;
    let negativeFlags: number = 0;

    const noLongerActiveMembershipORSelector: {backendId: string}[] = [];

    for (const membership of user.memberships) {
        if (!membership.active) continue;

        if (membership.expiration && membership.expiration > 0 && membership.expiration < Math.floor(new Date().getTime() / 1000)) {
            noLongerActiveMembershipORSelector.push({backendId: membership.backendId});
            continue;
        }

        positiveFlags |= membership.positiveFlags;
        negativeFlags |= membership.negativeFlags;
    }

    const oldFlags = user.subscriptionType;
    const newFlags = positiveFlags & ~negativeFlags;

    console.log({oldFlags, newFlags, positiveFlags, negativeFlags});

    user.subscriptionType = newFlags;

    await Promise.all([
        db.membership.updateMany({
            where: { OR: noLongerActiveMembershipORSelector },
            data: { active: false }
        }),
        async function() {
            console.log('Checking if user flags need to be updated', {snowflake: user.snowflake, newFlags, oldFlags});
            if (alwaysRefreshDiscordMetadata || newFlags === oldFlags) return;
            console.log('Updating user flags for', {snowflake: user.snowflake, newFlags, oldFlags});
            Object.assign(user, await db.user.update({
                where: { snowflake: user.snowflake },
                data: { subscriptionType: newFlags },
            }));
            console.log('Updated user DB flags.');
        }(),
        async function() {
            console.log('Checking if user metadata needs to be recalculated', {snowflake: user.snowflake, newFlags, oldFlags});
            if (newFlags === oldFlags) return;
            console.log('Recalculating user metadata for', {snowflake: user.snowflake, newFlags, oldFlags});
            if (!user.snowflake || !user.discordAccessToken || typeof user.karma !== 'bigint' ) return console.warn('Missing Discord token for metadata recalculation', {snowflake: user.snowflake, newFlags, oldFlags});
            await recalcMetadata(user as typeof user & Pick<User, 'discordAccessToken'|'snowflake'|'subscriptionType'|'karma'>);
            console.log('Recalculated user metadata', {snowflake: user.snowflake, newFlags, oldFlags});
        }(),
    ]);

    console.log('User membership recalculated successfully.')

    return user as T & Pick<User, 'subscriptionType'>;
}

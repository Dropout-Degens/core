import { membership, user } from "@prisma/client";
import db from "../db.js";
import { recalcMetadata } from "../discord/application-metadata.js";
import { FindUniqueReturn, WithSnowflake } from "../index.js";

type DBUser = FindUniqueReturn<WithSnowflake<{include: {memberships: true}}>>;

export async function flattenMemberships<T extends {memberships: (Pick<DBUser['memberships'][number], 'active'|'backendId'|'positive_flags'|'negative_flags'> & Partial<DBUser['memberships'][number]>)[]} & Omit<Partial<DBUser>, 'memberships'> & Pick<DBUser, 'subscription_type'>>(user: T): Promise<T & Pick<DBUser, 'subscription_type'>> {
    let positiveFlags: number = 0;
    let negativeFlags: number = 0;

    const noLongerActiveMembershipORSelector: {backendId: number}[] = [];

    for (const membership of user.memberships) {
        if (!membership.active) continue;

        if (membership.expiration && membership.expiration > 0 && membership.expiration < Math.floor(new Date().getTime() / 1000)) {
            noLongerActiveMembershipORSelector.push({backendId: membership.backendId});
            continue;
        }

        positiveFlags |= membership.positive_flags;
        negativeFlags |= membership.negative_flags;
    }

    const oldFlags = user.subscription_type;
    const newFlags = positiveFlags & ~negativeFlags;

    console.log({oldFlags, newFlags, positiveFlags, negativeFlags});

    user.subscription_type = newFlags;

    await Promise.all([
        db.membership.updateMany({
            where: { OR: noLongerActiveMembershipORSelector },
            data: { active: false }
        }),
        async function() {
            console.log('Checking if user flags need to be updated', {snowflake: user.snowflake, newFlags, oldFlags});
            if (newFlags === oldFlags) return;
            console.log('Updating user flags for', {snowflake: user.snowflake, newFlags, oldFlags});
            Object.assign(user, await db.user.update({
                where: { snowflake: user.snowflake },
                data: { subscription_type: newFlags },
                include: { memberships: false }
            }));
            console.log('Updated user DB flags.');
        }(),
        async function() {
            console.log('Checking if user metadata needs to be recalculated', {snowflake: user.snowflake, newFlags, oldFlags});
            if (newFlags === oldFlags) return;
            console.log('Recalculating user metadata for', {snowflake: user.snowflake, newFlags, oldFlags});
            if (!user.snowflake || !user.discord_access_token || typeof user.karma !== 'bigint' ) return console.warn('Missing Discord token for metadata recalculation', {snowflake: user.snowflake, newFlags, oldFlags});
            await recalcMetadata(user as typeof user & Pick<user, 'discord_access_token'|'snowflake'|'subscription_type'|'karma'>);
            console.log('Recalculated user metadata', {snowflake: user.snowflake, newFlags, oldFlags});
        }(),
    ]);

    console.log('User membership recalculates successfully.')

    return user as T & Pick<user, 'subscription_type'>;
}

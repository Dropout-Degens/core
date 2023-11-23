import { membership, user } from "@prisma/client";
import db from "../db.js";
import { recalcMetadata } from "../discord/application-metadata.js";
import { FindUniqueReturn, WithSnowflake } from "../index.js";

type DBUser = FindUniqueReturn<WithSnowflake<{include: {memberships: true}}>>;

export async function flattenMemberships<T extends {memberships: (Pick<DBUser['memberships'][number], 'active'|'backendId'|'positive_flags'|'negative_flags'> & Partial<DBUser['memberships'][number]>)[]} & Omit<Partial<DBUser>, 'memberships'>>(user: T): Promise<T & Pick<DBUser, 'subscription_type'>> {
    let positiveFlags: number = 0;
    let negativeFlags: number = 0;

    const noLongerActiveMembershipORSelector: {backendId: number}[] = [];

    for (const membership of user.memberships) {
        if (!membership.active) continue;

        if (membership.expiration && membership.expiration > 0 && membership.expiration < (new Date().getTime() / 1000))
            noLongerActiveMembershipORSelector.push({backendId: membership.backendId});

        positiveFlags |= membership.positive_flags;
        negativeFlags |= membership.negative_flags;
    }

    const flags: number = positiveFlags & ~negativeFlags;
    const subTypeChanged = flags !== user.subscription_type;
    user.subscription_type = flags;

    await Promise.all([
        db.membership.updateMany({
            where: { OR: noLongerActiveMembershipORSelector },
            data: { active: false }
        }),
        async function() {
            if (!subTypeChanged) return;
            Object.assign(user, await db.user.update({
                where: { snowflake: user.snowflake },
                data: { subscription_type: flags },
                include: { memberships: false }
            }))
        },
        async function() {
            if (!subTypeChanged) return;
            if (!user.snowflake || !user.discord_access_token || typeof user.karma !== 'bigint' ) return;
            await recalcMetadata(user as typeof user & Pick<user, 'discord_access_token'|'snowflake'|'subscription_type'|'karma'>);
        },
    ])

    return user as T & Pick<user, 'subscription_type'>;
}

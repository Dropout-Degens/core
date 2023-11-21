import { membership, user } from "@prisma/client";
import db from "../db.js";
import { recalcMetadata } from "../discord/application-metadata.js";

const a = await db.user.findUnique({
    where: { snowflake: 1n },
    include: { memberships: true }
});

export async function flattenMemberships(user: {memberships: (Pick<membership, 'active'|'backendId'|'positive_flags'|'negative_flags'> & Partial<membership>)[]} & Partial<user>) {
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

    return user;
}

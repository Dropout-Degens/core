import type { APIGuildMember } from "discord.js";
import { z } from "zod";

export enum JoinSourceType {

    /*
        "errors": {
            "and_query": {
                "join_source_type": {
                    "or_query": {
                        "0": {
                            "_errors": [
                                {
                                    "code": "NUMBER_TYPE_MIN",
                                    "message": "int value should be greater than or equal to 0."
                                }
                            ]
                        }
                    }
                }
            }
        }
    */

    /**
     * Not even Discord knows how this user joined the server.
     *
     * Looking at data from different servers, it looks like Discord simply may not have been tracking this information before a certain point.
     * However, it is possible to have an unknown join method as recent as April 2nd, 2025, so there are definitely other situations as well.
     *
     * ```json
     * {
     *     "join_source_type": 0,
     *     "source_invite_code": null,
     *     "inviter_id": null,
     * }
     * ```
     */
    ActuallyUnknown = 0,

    /**
     * User joined via a Discord bot/application that added the user to the server.
     *
     * For example, this may have been the Whop or Patreon bot.
     *
     * ```json
     * {
     *     "join_source_type": 1,
     *     "source_invite_code": null,
     *     // ID of the bot that helped the user join
     *     "inviter_id": "815703008075579422e"
     * }
     * ```
     */
    BotInvite = 1,

    /** Unused? Found no results in all of Dropout Degens, Nexus Mods, nor private servers searching for `join_source_type` = 2 */
    PossiblyUnused2 = 2,

    /**
     * User joined via Discord's "Server Discovery" feature.
     *
     * ```json
     * {
     *     "join_source_type": 3,
     *     "source_invite_code": null,
     *     "inviter_id": null
     * }
     * ```
     */
    ServerDiscovery = 3,

    /** Unused? Found no results in all of Dropout Degens Nexus Mods, nor private servers searching for `join_source_type` = 4 */
    PossiblyUnused4 = 4,

    /**
     * User joined by following a non-vanity invite link.
     *
     * ```json
     * {
     *     "join_source_type": 5,
     *     // Invite code followed by the user
     *     "source_invite_code": "eDP6DDJUEt",
     *     // Issuer of the invite code
     *     "inviter_id": "340076015797796864"
     * }
     * ```
     */
    InviteLinkNonVanity = 5,

    /**
     * User joined by following a vanity link.
     *
     * ```json
     * {
     *     "join_source_type": 5,
     *     // Invite code followed by the user
     *     "source_invite_code": "dropoutdegens",
     *     // Null since the vanity invite code isn't "created" by a single user
     *     "inviter_id": null
     * }
     * ```
     */
    InviteLinkVanity = 6,

    /** Unused? Found no results in all of Dropout Degens, Nexus Mods, nor private servers searching for `join_source_type` = 7 */
    PossiblyUnused7 = 7,

    /*
        "errors": {
            "and_query": {
                "join_source_type": {
                    "or_query": {
                        "0": {
                            "_errors": [
                                {
                                    "code": "NUMBER_TYPE_MAX",
                                    "message": "int value should be less than or equal to 7."
                                }
                            ]
                        }
                    }
                }
            }
        }
    */
}

export interface MembersElasticsearchEndpointResponse {
    "guild_id": `${bigint}`,
    "members": Array<
        {
            "member": APIGuildMember
            "source_invite_code": string | null,
            "join_source_type": JoinSourceType,
            "inviter_id": `${bigint}` | null
        }
    >
}

export const membersElasticsearchEndpointResponseSchema = z.object({
    guild_id: z.string().transform((value) => BigInt(value)),
    members: z.array(z.object({
        member: z.any() as z.ZodType<APIGuildMember>,
        source_invite_code: z.string().nullable(),
        join_source_type: z.nativeEnum(JoinSourceType),
        inviter_id: z.string().nullable().refine((value) => {
            if (value === null) return true;
            try { BigInt(value); return true } catch { return false }
        }, { message: "Inviter ID must be a string made entirely of integer characters" }),
    })),
})

export const elasticsearchRetryLaterEndpointResponseSchema = z.object({
    message: z.string(),
    code: z.number().int(),
    documents_indexed: z.number().int().nonnegative(),
    retry_after: z.number().int().positive(),
})

export function stringifyJoinSourceType(joinSourceType: JoinSourceType): string {
    return JoinSourceType[joinSourceType];
}

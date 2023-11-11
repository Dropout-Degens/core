import { users } from "@prisma/client";
import { ApplicationRoleConnectionMetadataType, APIApplicationRoleConnectionMetadata, RESTPutAPIApplicationRoleConnectionMetadataJSONBody, Routes, RESTPutAPICurrentUserApplicationRoleConnectionJSONBody } from "discord-api-types/v10";
import RoleFlags from "../definitions.js";
import { bearerTokenREST, botREST } from "./REST.js";

export type MetadataSchemaObject = Record<string, Omit<APIApplicationRoleConnectionMetadata, 'key'>>;

export const applicationMetadataSchemaObject = {
    high_roller: {
        name: 'High Roller',
        description: 'You are a High Roller',
        type: ApplicationRoleConnectionMetadataType.BooleanEqual,
    },
    sportsbook: {
        name: 'Sportsbook',
        description: 'Your Dropout Degens subscription grants you access to our premium Sportsbook picks',
        type: ApplicationRoleConnectionMetadataType.BooleanEqual,
    },
    player_props: {
        name: 'Player Props',
        description: 'Your Dropout Degens subscription grants you access to our premium Player Props picks',
        type: ApplicationRoleConnectionMetadataType.BooleanEqual,
    },
    staff: {
        name: 'Staff',
        description: 'You are a staff member of Dropout Degens',
        type: ApplicationRoleConnectionMetadataType.BooleanEqual,
    },
    karma: {
        name: 'Karma',
        description: `Karma is a representation of how long you've been active with Dropout Degens.`,
        type: ApplicationRoleConnectionMetadataType.IntegerGreaterThanOrEqual,
    },
} as const satisfies Readonly<MetadataSchemaObject>;

for (const key in applicationMetadataSchemaObject)
    Object.assign(applicationMetadataSchemaObject[key as keyof typeof applicationMetadataSchemaObject], {key});

export const applicationMetadataSchema = Object.values(applicationMetadataSchemaObject) as {[K in keyof typeof applicationMetadataSchemaObject]: typeof applicationMetadataSchemaObject[K] & {key: K}}[keyof typeof applicationMetadataSchemaObject][] satisfies RESTPutAPIApplicationRoleConnectionMetadataJSONBody;

export const linkedRolesSchemaPutRequest = botREST.put(Routes.applicationRoleConnectionMetadata(process.env.DISCORD_CLIENT_ID!), {
    body: applicationMetadataSchema,
});




export const platform_name = 'Dropout Degens';

export class ExpiredAccessTokenError extends Error {
    constructor(id?: bigint) {
        super(`User with ID ${id} has an expired access token! Did you forget to call refreshToken() before calling recalcMetadata()?`);
        this.name = 'ExpiredAccessTokenError';
    }
}

// TODO: Add karma
/**
 * MAKE SURE YOU REFRESH THE ACCESS TOKEN BEFORE SENDING THIS REQUEST!!!
 *
 * @param user The user's database entry. Only the the subscription and access token are strictly needed. Access token should be refreshed.
 */
export async function recalcMetadata(user: Pick<users, 'subscription_type'|'discord_access_token'>) {
    await linkedRolesSchemaPutRequest;

    if ('discord_access_expiry' in user && typeof user.discord_access_expiry === 'bigint' && Date.now() > user.discord_access_expiry )
        throw new ExpiredAccessTokenError('snowflake' in user && typeof user.snowflake === 'bigint' && user.snowflake || undefined);

    const body = {
        metadata: {
            sportsbook: user.subscription_type & RoleFlags.Sportsbook ? 1 : 0,
            player_props: user.subscription_type & RoleFlags.PlayerProps ? 1 : 0,
            high_roller: user.subscription_type & RoleFlags.Van_HighRoller ? 1 : 0,
            staff: user.subscription_type & RoleFlags.AnyStaffRole ? 1 : 0,
        } as Record<keyof typeof applicationMetadataSchemaObject, string | number>,
        platform_name,
    } satisfies RESTPutAPICurrentUserApplicationRoleConnectionJSONBody;

    bearerTokenREST.setToken(user.discord_access_token!);
    return await bearerTokenREST.put(Routes.userApplicationRoleConnection(process.env.DISCORD_CLIENT_ID!), {body});
}

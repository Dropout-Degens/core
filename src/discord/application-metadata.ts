import { User } from '@prisma/client';
import { ApplicationRoleConnectionMetadataType, APIApplicationRoleConnectionMetadata, RESTPutAPIApplicationRoleConnectionMetadataJSONBody, Routes, RESTPutAPICurrentUserApplicationRoleConnectionJSONBody, RESTPutAPICurrentUserApplicationRoleConnectionResult } from "discord-api-types/v10";
import RoleFlags from "../definitions";
import { bearerTokenREST, botREST } from "./REST";
import { DiscordAPIError } from '@discordjs/rest';
import { ExpiredAccessTokenError, InvalidGrantError } from '../errors';
import db from '../db';
import { refreshToken } from './refresh-token';

export type MetadataSchemaObject = Record<string, Omit<APIApplicationRoleConnectionMetadata, 'key'>>;

export const applicationMetadataSchemaObject = {
    all_access: {
        name: 'All Access',
        description: 'Your have a premium All Access subscription with Dropout Degens',
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

export async function recalcMetadata(user: Pick<User, 'subscriptionType'|'discordAccessToken'|'karma'> & Partial<User>): Promise<RESTPutAPICurrentUserApplicationRoleConnectionResult> {
    await linkedRolesSchemaPutRequest;

    const now = Math.ceil(Date.now() / 1000);
    const expiry = Number(user.discordAccessExpiry ?? 0) - 2;
    if (user.discordAccessExpiry && now > expiry ) {
        if (user.snowflake && user.discordRefreshToken)
            await refreshToken(user as typeof user & Pick<User, 'snowflake'|'discordRefreshToken'|'discordAccessExpiry'>);
        else {
            console.log('Not recalculating metadata because the access token has expired.', {expiry, now});
            throw new ExpiredAccessTokenError(user.snowflake);
        }
    }

    const body = {
        metadata: {
            all_access: user.subscriptionType & (RoleFlags.Betting | RoleFlags.ExpectedValue) ? 1 : 0,
            staff: user.subscriptionType & RoleFlags.AnyStaffRole ? 1 : 0,
            karma: user.karma?.toString() ?? '0',
        } satisfies Record<keyof typeof applicationMetadataSchemaObject, string | number>,
        platform_name,
    } satisfies RESTPutAPICurrentUserApplicationRoleConnectionJSONBody;

    bearerTokenREST.setToken(user.discordAccessToken!);

    try {

        const res = await bearerTokenREST.put(Routes.userApplicationRoleConnection(process.env.DISCORD_CLIENT_ID!), {body}) as RESTPutAPICurrentUserApplicationRoleConnectionResult;

        for (const key in body.metadata) {
            const expected = body.metadata[key as keyof typeof body.metadata];
            const actual = res.metadata[key as keyof typeof res.metadata];

            if (expected?.toString() !== actual?.toString()) throw new Error(`Role metadata for key ${key} was not set correctly! Expected ${expected} but got ${actual}!`);
        }

        return res;
    } catch (e) {

        if (e instanceof DiscordAPIError && e.message == 'invalid_grant') {
            console.log(`Failed to refresh Discord access token for user ${user.snowflake} because the refresh token is invalid. Removing any active auth sessions.`, {user});
            await db.authSession.deleteMany({ where: { user: { snowflake: user.snowflake } }});
            throw new InvalidGrantError(user.snowflake, e);
        }

        console.error('Failed to recalculate metadata!', {user, body, e});
        throw e;
    }
}

import { users } from "@prisma/client";
import db from "../db.js";
import { Routes, RESTPostOAuth2RefreshTokenURLEncodedData, RESTPostOAuth2RefreshTokenResult } from 'discord-api-types/v10';
import { botREST } from "./REST.js";

export class NoRefreshTokenError extends Error {
    constructor(id: bigint) {
        super(`User with ID ${id} does not have a refresh token!`);
        this.name = 'NoRefreshTokenError';
    }
}

export async function refreshToken<T extends Pick<users, 'snowflake'|'discord_access_token'|'discord_access_expiry'|'discord_refresh_token'> & Partial<users>>(user: T, force = false): Promise<T & Pick<users, 'discord_access_token'|'discord_access_expiry'|'discord_refresh_token'>> {
    if (!process.env.DISCORD_CLIENT_ID) throw new Error('Environment variable `DISCORD_CLIENT_ID` not set!');
    if (!process.env.DISCORD_CLIENT_SECRET) throw new Error('Environment variable `DISCORD_CLIENT_SECRET` not set!');

    console.log(`Token refresh has been requested for user ${user.snowflake}. Checking if a refresh is needed.`)

    if (!user.discord_refresh_token) {
        console.log(`User ${user.snowflake} does not have a refresh token!`, {user});

        if (user.auth_session_token) {
            console.log(`User ${user.snowflake} does have an auth session token. Removing it so they're forced to log in again...`);
            await db.users.update({ where: { snowflake: user.snowflake }, data: { auth_session_token: null, auth_session_token_expires: 0 }});
        }

        throw new NoRefreshTokenError(user.snowflake);
    }


    if (!force && Date.now() > (user.discord_access_expiry - 60000n) ) {
        console.log(`Not refreshing Discord access token for user ${user.snowflake} because it has not yet expired.`, {expiry: user.discord_access_expiry, now: Date.now()});
        return user;
    }

    console.log(`Refreshing Discord access token for user ${user.snowflake}. Forced? ${force}`);

    let tokenResponse: RESTPostOAuth2RefreshTokenResult;
    try {
        tokenResponse = await botREST.post(Routes.oauth2TokenExchange(), {
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: user.discord_refresh_token,
                client_id: process.env.DISCORD_CLIENT_ID,
                client_secret: process.env.DISCORD_CLIENT_SECRET,
            } satisfies RESTPostOAuth2RefreshTokenURLEncodedData).toString(),
            passThroughBody: true,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) as RESTPostOAuth2RefreshTokenResult;
    } catch(e) {
        throw new Error(`Failed to refresh Discord access token for user ${user.snowflake}`, {cause: e});
    }

    console.log('Refreshed Discord access token. Updating DB entry.', {tokenResponse});

    return Object.assign(user, await db.users.update({
        where: {snowflake: user.snowflake},
        data: {
            discord_access_token: tokenResponse.access_token,
            discord_refresh_token: tokenResponse.refresh_token,
            discord_access_expiry: Date.now() + tokenResponse.expires_in * 1000,
        },
    })) as T;
}

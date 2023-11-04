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

export async function refreshToken<T extends Pick<users, 'snowflake'|'discord_access_token'|'discord_access_expiry'|'discord_refresh_token'>>(user: T, force = false) {
    if (!process.env.DISCORD_CLIENT_ID) throw new Error('Environment variable `DISCORD_CLIENT_ID` not set!');
    if (!process.env.DISCORD_CLIENT_SECRET) throw new Error('Environment variable `DISCORD_CLIENT_SECRET` not set!');

    if (!user.discord_refresh_token) {
        if ('auth_session_token' in user && !user.auth_session_token) await db.users.update({ where: { snowflake: user.snowflake }, data: { auth_session_token: null, auth_session_token_expires: 0 }});
        throw new Error(`User by id ${user.snowflake} does not have a refresh token!`);
    }


    if (!force && Date.now() > user.discord_access_expiry + 60000n ) return user;

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
    } catch {
        throw new Error(`Failed to refresh Discord access token for user ${user.snowflake}`);
    }

    console.log('Refreshed Discord access token', {tokenResponse});

    return Object.assign(user, await db.users.update({
        where: {snowflake: user.snowflake},
        data: {
            discord_access_token: tokenResponse.access_token,
            discord_refresh_token: tokenResponse.refresh_token,
            discord_access_expiry: Date.now() + tokenResponse.expires_in * 1000,
        },
    })) as users;
}

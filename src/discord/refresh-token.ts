import { users } from "@prisma/client";
import db from "../db.js";
import { Routes, RESTPostOAuth2RefreshTokenURLEncodedData, RESTPostOAuth2RefreshTokenResult } from 'discord.js';
import { botREST } from "./REST.js";

export async function refreshToken<T extends Pick<users, 'snowflake'|'discord_access_token'|'discord_access_expiry'|'discord_refresh_token'>>(user: T, force = false) {
    if (!process.env.DISCORD_CLIENT_ID) throw new Error('Environment variable `DISCORD_CLIENT_ID` not set!');
    if (!process.env.DISCORD_CLIENT_SECRET) throw new Error('Environment variable `DISCORD_CLIENT_SECRET` not set!');

    if (!user.discord_refresh_token) throw new Error(`User by id ${user.snowflake} does not have a refresh token!`);

    if (!force && user.discord_access_expiry + 60000n > Date.now()) return user;

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

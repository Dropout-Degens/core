import { User } from '@prisma/client';
import db from "../db";
import { Routes, RESTPostOAuth2RefreshTokenURLEncodedData, RESTPostOAuth2RefreshTokenResult } from 'discord-api-types/v10';
import { botREST } from "./REST";
import { DiscordAPIError } from '@discordjs/rest';
import { InvalidGrantError, NoRefreshTokenError } from '../errors';

export async function refreshToken<T extends Pick<User, 'snowflake'|'discordAccessToken'|'discordAccessExpiry'|'discordRefreshToken'> & Partial<User>>(user: T, force = false): Promise<T & Pick<User, 'discordAccessToken'|'discordAccessExpiry'|'discordRefreshToken'>> {
    if (!process.env.DISCORD_CLIENT_ID) throw new Error('Environment variable `DISCORD_CLIENT_ID` not set!');
    if (!process.env.DISCORD_CLIENT_SECRET) throw new Error('Environment variable `DISCORD_CLIENT_SECRET` not set!');

    console.log(`Token refresh has been requested for user ${user.snowflake}. Checking if a refresh is needed.`)

    if (!user.discordRefreshToken) {
        console.log(`User ${user.snowflake} does not have a refresh token!`, {user});

        console.log(`User ${user.snowflake} does not have a refresh token! Removing any active auth sessions.`, {user});
        await db.authSession.deleteMany({ where: { user: { snowflake: user.snowflake } }});

        throw new NoRefreshTokenError(user.snowflake);
    }

    const now = Math.ceil(Date.now() / 1000);
    const expiry = Number(user.discordAccessExpiry) + 60;
    if (!force && now < expiry ) {
        console.log(`Not refreshing Discord access token for user ${user.snowflake} because it has not yet expired.`, {expiry, now});
        return user;
    }

    console.log(`Refreshing Discord access token for user ${user.snowflake}. Forced? ${force}`);

    let tokenResponse: RESTPostOAuth2RefreshTokenResult;
    try {
        tokenResponse = await botREST.post(Routes.oauth2TokenExchange(), {
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: user.discordRefreshToken,
                client_id: process.env.DISCORD_CLIENT_ID,
                client_secret: process.env.DISCORD_CLIENT_SECRET,
            } satisfies RESTPostOAuth2RefreshTokenURLEncodedData).toString(),
            passThroughBody: true,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) as RESTPostOAuth2RefreshTokenResult;
    } catch(e) {
        if (e instanceof DiscordAPIError && e.message == 'invalid_grant') {
            console.log(`Failed to refresh Discord access token for user ${user.snowflake} because the refresh token is invalid. Removing any active auth sessions.`, {user});
            await db.authSession.deleteMany({ where: { user: { snowflake: user.snowflake } }});
            throw new InvalidGrantError(user.snowflake, e);
        }

        console.error(`Failed to refresh Discord access token for user ${user.snowflake}!`, {user, e})
        throw e;
    }

    console.log('Refreshed Discord access token. Updating DB entry.', {tokenResponse});

    return Object.assign(user, await db.user.update({
        where: {snowflake: user.snowflake},
        data: {
            discordAccessToken: tokenResponse.access_token,
            discordRefreshToken: tokenResponse.refresh_token,
            discordAccessExpiry: Math.floor(Date.now() / 1000) + tokenResponse.expires_in,
        },
    })) as T;
}

import { users } from "@prisma/client";
import db from "../db";
import { Routes, RESTPostOAuth2RefreshTokenURLEncodedData, RESTPostOAuth2RefreshTokenResult } from 'discord.js';
import { botREST } from "./REST";


export async function revokeToken(user: Pick<users, 'snowflake'|'discord_access_token'|'discord_access_expiry'|'discord_refresh_token'>, force = false) {
    if (!process.env.DISCORD_CLIENT_ID) throw new Error('Environment variable `DISCORD_CLIENT_ID` not set!');
    if (!process.env.DISCORD_CLIENT_SECRET) throw new Error('Environment variable `DISCORD_CLIENT_SECRET` not set!');

    const tokenResponse = botREST.post(Routes.oauth2TokenExchange(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: user.discord_refresh_token!,
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
        } satisfies RESTPostOAuth2RefreshTokenURLEncodedData),
    }) as Promise<RESTPostOAuth2RefreshTokenResult>;

}

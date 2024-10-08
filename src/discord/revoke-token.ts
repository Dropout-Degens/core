import { user } from '@prisma/client';
import db from "../db";
import { Routes } from 'discord-api-types/v10';
import { botREST } from "./REST";


export async function revokeToken<T extends Pick<user, 'snowflake'|'discord_access_token'> & Partial<user>>(user: T): Promise<(T & { discord_access_token: null, discord_refresh_token: null, discord_access_expiry: 0n }) | undefined> {
    if (!process.env.DISCORD_CLIENT_ID) throw new Error('Environment variable `DISCORD_CLIENT_ID` not set!');
    if (!process.env.DISCORD_CLIENT_SECRET) throw new Error('Environment variable `DISCORD_CLIENT_SECRET` not set!');

    const token = user?.discord_access_token;
    if (!token) return;

    await botREST.post(Routes.oauth2TokenRevocation(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', },
        body: new URLSearchParams({
            token,
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
        }),
    });

    return Object.assign(
        user,
        await db.user.update({
            where: {snowflake: user.snowflake},
            data: {
                discord_access_token: null,
                discord_refresh_token: null,
                discord_access_expiry: 0,
            }
        })
    ) as T & { discord_access_token: null, discord_refresh_token: null, discord_access_expiry: 0n };
}

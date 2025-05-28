import { User } from '@prisma/client';
import db from "../db";
import { Routes } from 'discord-api-types/v10';
import { botREST } from "./REST";


export async function revokeToken<T extends Pick<User, 'snowflake'|'discordAccessToken'> & Partial<User>>(user: T): Promise<(T & { discordAccessToken: null, discordRefreshToken: null, discordAccessExpiry: 0n }) | undefined> {
    if (!process.env.DISCORD_CLIENT_ID) throw new Error('Environment variable `DISCORD_CLIENT_ID` not set!');
    if (!process.env.DISCORD_CLIENT_SECRET) throw new Error('Environment variable `DISCORD_CLIENT_SECRET` not set!');

    const token = user?.discordAccessToken;
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
                discordAccessToken: null,
                discordRefreshToken: null,
                discordAccessExpiry: 0,
            }
        })
    ) as T & { discordAccessToken: null, discordRefreshToken: null, discordAccessExpiry: 0n };
}

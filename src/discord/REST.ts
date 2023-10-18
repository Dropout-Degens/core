import { REST as DiscordREST } from '@discordjs/rest';

export const botREST = new DiscordREST({authPrefix: 'Bot'});
botREST.setToken(process.env.DISCORD_BOT_TOKEN!);

export const bearerTokenREST = new DiscordREST({authPrefix: 'Bearer'});

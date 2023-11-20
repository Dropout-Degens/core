import { REST as DiscordREST } from '@discordjs/rest';

export const botREST = (()=> {
    if (!process.env.DISCORD_BOT_TOKEN) {
        const mockBotREST = new DiscordREST({authPrefix: 'Bot'});
        console.warn('Discord bot token not found. Creating a mock REST client which will warn when called.');
        for (const method of ['delete', 'get', 'patch', 'post', 'put'] as const)
            mockBotREST[method] = () => {
                console.warn(`Discord bot REST method ${method.toUpperCase()} called without token. This can be safely ignored in build mode.`);
                return Promise.resolve();
            };

        return mockBotREST;
    }

    const botREST = new DiscordREST({authPrefix: 'Bot'});
    botREST.setToken(process.env.DISCORD_BOT_TOKEN!);
    return botREST;
})();

export const bearerTokenREST = new DiscordREST({authPrefix: 'Bearer'});

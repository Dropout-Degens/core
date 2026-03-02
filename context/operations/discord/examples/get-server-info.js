const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once('ready', async () => {
    console.log(`Connected as ${client.user.tag}\n`);

    const guild = client.guilds.cache.first();
    if (!guild) {
        console.error('Bot is not in any servers.');
        client.destroy();
        return;
    }

    // Fetch full guild data (member count, etc. require this)
    const fullGuild = await guild.fetch();
    await fullGuild.roles.fetch();
    await fullGuild.channels.fetch();

    const info = {
        id: fullGuild.id,
        name: fullGuild.name,
        memberCount: fullGuild.memberCount,
        createdAt: fullGuild.createdAt.toISOString(),
        boostLevel: fullGuild.premiumTier,
        boostCount: fullGuild.premiumSubscriptionCount,
        channelCount: fullGuild.channels.cache.size,
        roleCount: fullGuild.roles.cache.size,
        ownerId: fullGuild.ownerId,
        description: fullGuild.description ?? null,
        roles: fullGuild.roles.cache
            .filter(r => r.name !== '@everyone')
            .sort((a, b) => b.position - a.position)
            .map(r => ({
                id: r.id,
                name: r.name,
                memberCount: r.members?.size ?? null,
                color: r.hexColor,
            })),
    };

    console.log(`Server: ${info.name} (${info.id})`);
    console.log(`Members: ${info.memberCount}`);
    console.log(`Channels: ${info.channelCount}`);
    console.log(`Roles: ${info.roleCount}`);
    console.log(`Boost Level: ${info.boostLevel} (${info.boostCount} boosts)`);
    console.log(`Created: ${new Date(info.createdAt).toLocaleDateString()}`);
    console.log(`\nRoles:`);
    for (const role of info.roles) {
        console.log(`  ${role.name} — ${role.id}`);
    }

    // Save to JSON
    const fs = require('fs');
    if (!fs.existsSync('exports')) fs.mkdirSync('exports');
    const filename = `exports/server_info_${fullGuild.id}_${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(info, null, 2));
    console.log(`\nSaved to ${filename}`);

    client.destroy();
});

client.login(process.env.DISCORD_TOKEN);
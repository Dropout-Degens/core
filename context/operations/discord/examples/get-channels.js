const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const CHANNEL_TYPE_LABELS = {
    [ChannelType.GuildText]: 'text',
    [ChannelType.GuildVoice]: 'voice',
    [ChannelType.GuildCategory]: 'category',
    [ChannelType.GuildForum]: 'forum',
    [ChannelType.GuildAnnouncement]: 'announcement',
    [ChannelType.GuildStageVoice]: 'stage',
};

client.once('ready', async () => {
    console.log(`Connected as ${client.user.tag}\n`);

    const guild = client.guilds.cache.first();
    if (!guild) {
        console.error('Bot is not in any servers.');
        client.destroy();
        return;
    }

    await guild.channels.fetch();

    const channels = guild.channels.cache
        .sort((a, b) => (a.rawPosition ?? 0) - (b.rawPosition ?? 0))
        .map(ch => ({
            id: ch.id,
            name: ch.name,
            type: CHANNEL_TYPE_LABELS[ch.type] ?? ch.type,
            category: ch.parent?.name ?? null,
            categoryId: ch.parentId ?? null,
        }));

    console.log(`Server: ${guild.name}`);
    console.log(`Total channels: ${channels.length}\n`);

    // Group by category for readable output
    const byCategory = {};
    for (const ch of channels) {
        if (ch.type === 'category') continue;
        const cat = ch.category ?? 'No Category';
        if (!byCategory[cat]) byCategory[cat] = [];
        byCategory[cat].push(ch);
    }

    for (const [cat, chs] of Object.entries(byCategory)) {
        console.log(`[${cat}]`);
        for (const ch of chs) {
            console.log(`  ${ch.name} (${ch.type}) — ${ch.id}`);
        }
        console.log('');
    }

    // Save full list to JSON
    const fs = require('fs');
    if (!fs.existsSync('exports')) fs.mkdirSync('exports');
    const filename = `exports/channels_${guild.id}_${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(channels, null, 2));
    console.log(`Saved to ${filename}`);

    client.destroy();
});

client.login(process.env.DISCORD_TOKEN);
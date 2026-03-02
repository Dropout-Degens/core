const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const fs = require('fs');

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

// Function to create invite links
async function createInviteLink(channelId, options = {}) {
    try {
        const channel = await client.channels.fetch(channelId);
        if (!channel) {
            throw new Error(`Channel ${channelId} not found`);
        }

        // Default options for permanent invite
        const inviteOptions = {
            maxAge: options.maxAge || 0, // 0 = never expires
            maxUses: options.maxUses || 0, // 0 = unlimited uses
            unique: options.unique !== undefined ? options.unique : true,
            reason: options.reason || 'Created via bot'
        };

        console.log(`🔗 Creating invite for #${channel.name}...`);
        const invite = await channel.createInvite(inviteOptions);

        console.log(`✅ Invite created: ${invite.url}`);
        console.log(`   Code: ${invite.code}`);
        console.log(`   Expires: ${invite.maxAge === 0 ? 'Never' : `${invite.maxAge} seconds`}`);
        console.log(`   Max Uses: ${invite.maxUses === 0 ? 'Unlimited' : invite.maxUses}`);

        return {
            url: invite.url,
            code: invite.code,
            channelName: channel.name,
            channelId: channel.id,
            maxAge: invite.maxAge,
            maxUses: invite.maxUses,
            createdAt: new Date().toISOString()
        };

    } catch (error) {
        console.error(`❌ Error creating invite:`, error);
        throw error;
    }
}

// Function to create multiple invites
async function createMultipleInvites(channelId, count = 1, options = {}) {
    try {
        console.log(`🔗 Creating ${count} invite link(s) for channel ${channelId}...`);
        const invites = [];

        for (let i = 0; i < count; i++) {
            const invite = await createInviteLink(channelId, options);
            invites.push(invite);
            console.log(`\n   [${i + 1}/${count}] Created: ${invite.url}\n`);

            // Small delay between creates to avoid rate limiting
            if (i < count - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        // Save invites to file
        if (!fs.existsSync('exports')) {
            fs.mkdirSync('exports');
        }

        const filename = `exports/invites_${channelId}_${Date.now()}.json`;
        fs.writeFileSync(filename, JSON.stringify(invites, null, 2));
        console.log(`\n💾 Invites saved to: ${filename}\n`);

        // Display all invite links
        console.log('📋 All invite links:');
        invites.forEach((inv, idx) => {
            console.log(`   ${idx + 1}. ${inv.url}`);
        });

        return invites;

    } catch (error) {
        console.error(`❌ Error creating multiple invites:`, error);
        throw error;
    }
}

// When the client is ready, run this code
client.once('ready', async () => {
    console.log(`✅ Bot is ready! Logged in as ${client.user.tag}`);
    console.log(`🏠 Connected to ${client.guilds.cache.size} servers\n`);

    // Get command line arguments
    const channelId = process.argv[2];
    const count = parseInt(process.argv[3]) || 1;

    if (!channelId) {
        console.log(`❌ Usage: node create_invites.js [CHANNEL_ID] [COUNT]`);
        console.log(`   Example: node create_invites.js 1102118618097012776 2`);
        client.destroy();
        return;
    }

    try {
        await createMultipleInvites(channelId, count);
        console.log(`\n✅ Successfully created ${count} invite link(s)!`);
    } catch (error) {
        console.error(`\n❌ Failed to create invites:`, error.message);
    } finally {
        client.destroy();
    }
});

// Handle errors
client.on('error', error => {
    console.error('❌ Discord client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('❌ Unhandled promise rejection:', error);
});

// Login to Discord
console.log('🚀 Starting Discord bot...\n');
client.login(process.env.DISCORD_TOKEN);

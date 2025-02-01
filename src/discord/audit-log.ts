import type { ChatInputCommandInteraction, InteractionType, MessageInteractionMetadata, RawFile, WebhookMessageCreateOptions } from "discord.js";
import { ApplicationCommandType, Routes } from 'discord-api-types/v10';
import { botREST } from "./REST";


const DISCORD_AUDIT_LOG_CHANNELS = process.env.DISCORD_AUDIT_LOG_CHANNELS || '';
if (!DISCORD_AUDIT_LOG_CHANNELS && typeof window === 'undefined') {
    throw new Error('DISCORD_AUDIT_LOG_CHANNELS is not defined in the environment variables.');
}

const AuditLogChannelIDs = DISCORD_AUDIT_LOG_CHANNELS!.trim().split(",").map((c) => c.trim());

//export async function auditInfo(message: string, ...attachments: RawFile[]) {
//    auditRaw({
//
//    })
//}

export async function auditAdminCommand(execution: MessageContextMenuCommandInteraction | ChatInputCommandInteraction, def: InteractionDefinition<MessageApplicationCommandData | ApplicationCommandSubCommandData, true>) {
    const subcommandGroup = execution.isChatInputCommand() ? execution.options.getSubcommandGroup() : null;
    const subcommand = execution.isChatInputCommand() ? execution.options.getSubcommand() : null;

    if (def.interaction.type === ApplicationCommandType.Message) {
        const messageExecution = execution as MessageContextMenuCommandInteraction;
        return await auditRaw({
            content: `${messageExecution.user.toString()} executed \`/${messageExecution.commandName}\``,
            embeds: [{
                title: messageExecution.commandName,
                fields: [
                    {name: 'Message Author', value: messageExecution.targetMessage.author.toString(), inline: true},
                    {name: 'Message', value: `https://discord.com/channels/${messageExecution.guildId}/${messageExecution.channelId}/${messageExecution.targetMessage.id})`, inline: true},
                    {
                        name: 'Message Content',
                        value: messageExecution.targetMessage.content,
                        inline: false,
                    }
                ]
            }],
            allowedMentions: { roles: [] },
        });
    } else {
        const slashCommandExecution = execution as ChatInputCommandInteraction;
        return await auditRaw({
            content: `${slashCommandExecution.user.toString()} executed \`/${slashCommandExecution.commandName + (subcommandGroup ? ' ' + subcommandGroup : '') + (subcommand ? ' ' + subcommand : '')}\``,
            embeds: [{
                title: def.interaction.description,
                fields: def.interaction.options?.map(option => {
                    const value = slashCommandExecution.options.get(option.name);
                    return {
                        name: value !== null ? `✔   ${option.name}` : `✖   ~~*${option.name}*~~`,
                        value: `${option.description}\n` + (value === null ? '*Unspecified*' : value.attachment ? `[Attachment](${value.attachment.url})` : value.channel?.toString() ?? value.member?.toString() ?? value.message?.toString() ?? value.role?.toString() ?? value.user?.toString() ?? value.value?.toString() ?? '```json\n' + value + '\n```'),
                        inline: false,
                    }
                }),
            }],
            allowedMentions: { roles: [] },
        });
    }
}

export async function auditRaw(body: WebhookMessageCreateOptions, ...attachments: RawFile[]) {
    const promise = Promise.all(AuditLogChannelIDs.map(id => botREST.post(Routes.channelMessages(id), {
        body, files: attachments.length ? attachments : undefined
    } )));

    if (process.env.NODE_ENV === 'development') {
        await promise.catch(console.error);
    } else {
        await promise
    }
}

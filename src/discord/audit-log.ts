import type { ChatInputCommandInteraction, RawFile, WebhookMessageCreateOptions } from "discord.js";
import { Routes } from 'discord-api-types/v10';
import { botREST } from "./REST.js";

const AuditLogChannelID = process.env.DISCORD_AUDIT_LOG_CHANNEL!;

//export async function auditInfo(message: string, ...attachments: RawFile[]) {
//    auditRaw({
//
//    })
//}

export async function auditAdminCommand(execution: ChatInputCommandInteraction, def: InteractionDefinition<ApplicationCommandSubCommandData, true>) {
    const subcommandGroup = execution.options.getSubcommandGroup();
    const subcommand = execution.options.getSubcommand();

    return await auditRaw({
        content: `${execution.user.toString()} executed \`/${execution.commandName + (subcommandGroup ? ' ' + subcommandGroup : '') + (subcommand ? ' ' + subcommand : '')}\``,
        embeds: [{
            title: def.interaction.description,
            fields: def.interaction.options?.map(option => {
                const value = execution.options.get(option.name);
                return {
                    name: value !== null ? `✔   ${option.name}` : `✖   ~~*${option.name}*~~`,
                    value: `${option.description}\n` + (value === null ? '*Unspecified*' : value.attachment ? `[Attachment](${value.attachment.url})` : value.channel?.toString() ?? value.member?.toString() ?? value.message?.toString() ?? value.role?.toString() ?? value.user?.toString() ?? value.value?.toString() ?? '```json\n' + value + '\n```'),
                    inline: false,
                }
            }),
        }],
        allowedMentions: { parse: [] },
    });
}

export async function auditRaw(body: WebhookMessageCreateOptions, ...attachments: RawFile[]) {
    return await botREST.post(Routes.channelMessages(AuditLogChannelID), { body, files: attachments.length ? attachments : undefined } );
}

type Awaitable<T> = import('discord.js').Awaitable<T>
type Snowflake = import('discord.js').Snowflake

type ApplicationCommandData = import('discord.js').ApplicationCommandData
type CommandInteraction = import('discord.js').CommandInteraction

type UserApplicationCommandData = import('discord.js').UserApplicationCommandData
type UserContextMenuCommandInteraction = import('discord.js').UserContextMenuCommandInteraction

type MessageApplicationCommandData = import('discord.js').MessageApplicationCommandData
type MessageContextMenuCommandInteraction = import('discord.js').MessageContextMenuCommandInteraction

type ChatInputApplicationCommandData = import('discord.js').ChatInputApplicationCommandData
type ChatInputCommandInteraction = import('discord.js').ChatInputCommandInteraction

type ApplicationCommandSubCommandData = import('discord.js').ApplicationCommandSubCommandData
type ApplicationCommandSubGroupData = import('discord.js').ApplicationCommandSubGroupData
type ApplicationCommandOptionData = import('discord.js').ApplicationCommandOptionData

type SubcommandOrGroup = ApplicationCommandSubCommandData | ApplicationCommandSubGroupData
type Interactable = ApplicationCommandData | SubcommandOrGroup

type InteractionReplyOptions = import('discord.js').InteractionReplyOptions
type InteractionEditReplyOptions = import('discord.js').InteractionEditReplyOptions
type InteractionUpdateOptions = import('discord.js').InteractionUpdateOptions
type GenericInteractionReply = InteractionReplyOptions & InteractionEditReplyOptions & InteractionUpdateOptions

// I'd have loved to use an interface that extends a generic type, but that's not possible in TS at the moment 🙁;
type ExtendedChatInputOptionsData<TType extends (Interactable & {options?: readonly any[]}), TRaw = false> = Omit<TType, 'options'> & {
    options: (Exclude<ApplicationCommandOptionData, ApplicationCommandSubCommandData | ApplicationCommandSubGroupData> | (
        TType extends ApplicationCommandSubCommandData ? never
        : TType extends ApplicationCommandSubGroupData ? InteractionDefinition<ApplicationCommandSubCommandData, TRaw>
        : TType extends ChatInputApplicationCommandData ? InteractionDefinition<ApplicationCommandSubGroupData | ApplicationCommandSubCommandData, TRaw>
        : never
    ))[];
}
interface InteractionDefinitionGuildDeclaration {
    /** The guild(s) that the interaction should be registered in. If omitted, the interaction will be registered globally. */
    guilds?: Snowflake[] | Snowflake
}


/** Provides extended attributes to supporting interfaces */
type ExtendedInteractionType<TType extends Interactable>
    = TType extends ChatInputApplicationCommandData
        ? ExtendedChatInputOptionsData<ChatInputApplicationCommandData>
        : TType extends ApplicationCommandSubCommandData|ApplicationCommandSubGroupData
            ? ExtendedChatInputOptionsData<TType>
            : TType;

/** Provides extended attributes to supporting interfaces, but without the name property and setting the options property to optional */
type RawExtendedInteractionType<TType extends Interactable> = Omit<ExtendedInteractionType<TType>, 'name'|'options'> & (TType extends {options?: unknown} ? { options?: ExtendedInteractionType<TType>['options'] } : {});


interface InteractionDefinitionHelpInfo {
    /** The command's name as shown in the help dropdown */
    prettyName?: string;

    /** Emoji to show in the help dropdown */
    emoji?: string;

    /** String to be shown in the help text. Defaults to the command's description. */
    tagline?: string;

    /** Extended description to show in the help text */
    extendedDescription?: string;
}

interface InteractionDefinitionUsageInfo extends InteractionDefinitionHelpInfo {
    /** Command usage documentation */
    usage?: string;

    /** Usage examples for the command */
    examples?: string[];
}

/** Describes an interaction that might not be able to be executed */
interface NonExecutableInteractionDefinition<TType extends Interactable, TRaw = false> extends InteractionDefinitionGuildDeclaration {
    /** Information required by Discord's API */
    interaction: TRaw extends true ? RawExtendedInteractionType<TType> : ExtendedInteractionType<TType>;

    /** Data used to generate the /help command
     *
     * If set to false, this command will be hidden from /help.
    */
    helpData?: false | (TType extends Interactable & {options?: readonly any[]} ? InteractionDefinitionUsageInfo : InteractionDefinitionHelpInfo);
}

type InteractionFromData<TType extends Exclude<Interactable, ApplicationCommandSubGroupData>> =
                          TType extends UserApplicationCommandData ? UserContextMenuCommandInteraction
                        : TType extends MessageApplicationCommandData ? MessageContextMenuCommandInteraction
                        : TType extends ChatInputApplicationCommandData | ApplicationCommandSubCommandData ? ChatInputCommandInteraction
                        : CommandInteraction

/** Describes an interaction that can be executed */
interface ExecutableInteractionDefinition<TType extends Exclude<Interactable, ApplicationCommandSubGroupData>, TRaw = false> extends NonExecutableInteractionDefinition<TType, TRaw> {
    /** Function called when this interaction is executed */
    execute(execution : InteractionFromData<TType>): Awaitable<unknown>;

    /** Whether this interaction is a debug function and should not be used outside of development */
    debug?: boolean;
}

/** Describes an interaction that may or may not be executable, narrowing the type when possible */
type InteractionDefinition<TType extends Interactable = Interactable, TRaw = false> =
    TType extends ApplicationCommandSubGroupData ?
        NonExecutableInteractionDefinition<TType, TRaw>
        : TType extends Exclude<Interactable, ApplicationCommandSubGroupData> ? ExecutableInteractionDefinition<TType, TRaw> : never

type RecursiveReadonly<T> = T extends object ? { readonly [P in keyof T]: RecursiveReadonly<T[P]> } : T;

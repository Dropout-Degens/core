import { inspect } from "util";
import z from "zod";

/**
 * This file ensures our environment variables remain standard, readable, and strictly-enforced at a high level.
 *
 * It includes a utility for parsing and validating environment variables with per-project required props.
 *
 */

// Important note: z.object() allows for extra properties BUT strips them at runtime

const envSchemaRawObject = {

    /** The environment the app is running in. This is used to determine the behavior of the app in situations like logging, whether to enable debug features, and so on. */
    NODE_ENV: z.enum(["production", "testing", "development"]).default("development").describe(
        "The environment the app is running in. This is used to determine the behavior of the app in situations like logging, whether to enable debug features, and so on."
    ),

    /** The port the app will listen on. */
    PORT: z.string().default("3000").transform(value => parseInt(value)).refine(value => value > 0 && value < 65536, { message: "PORT must be a valid port number" }).describe(
        "The port the app will listen on."
    ),

    /** The URL of the PostgreSQL database to connect to. */
    DATABASE_URL: z.string().refine(value => value.startsWith("postgresql://") || value.startsWith("postgres://"), {
        message: "DATABASE_URL must be a valid PostgreSQL URL",
    }).describe(
        "The URL of the PostgreSQL database to connect to."
    ),

    /** The URL of the PostgreSQL database to connect to for making changes to the database schema. For local development, this is the same as DATABASE_URL. */
    DATABASE_DIRECT_URL: z.string().refine(value => value.startsWith("postgresql://") || value.startsWith("postgres://"), {
        message: "DATABASE_DIRECT_URL must be a valid PostgreSQL URL",
    }).describe(
        "The URL of the PostgreSQL database to connect to for making changes to the database schema. For local development, this is the same as DATABASE_URL."
    ),

    /** The URL of the Supabase instance to connect to. */
    SUPABASE_URL: z.string().refine(value => URL.canParse(value), {
        message: "SUPABASE_URL must be a valid URL",
    }).describe(
        "The URL of the Supabase instance to connect to."
    ),

    /** The secret key (aka \ */
    SUPABASE_SECRET_KEY: z.string().describe(
        "The secret key (aka \"service key\") of the Supabase instance to connect to."
    ),

    /** A secret literal (for some level of security) provided by a cron job to trigger a reset of daily stats, such as Karma. (would've been handled in a cron job on the database, but it previously required token refreshing and such) */
    DAILY_RESET_SECRET: z.string().optional().describe(
        "A secret literal (for some level of security) provided by a cron job to trigger a reset of daily stats, such as Karma. (would've been handled in a cron job on the database, but it previously required token refreshing and such)"
    ),

    /** A public key used to validate incoming EV alerts from the @dropoutdegens/odds-email-worker service. */
    EV_ALERT_PUBLIC_KEY: z.string().optional().describe(
        "A public key used to validate incoming EV alerts from the @dropoutdegens/odds-email-worker service."
    ),

    /** A Stripe publishable key, possibly usable in the frontend website. */
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional().describe(
        "A Stripe publishable key, possibly usable in the frontend website."
    ),

    /** Secret key used to authenticate with the Stripe API. */
    STRIPE_SECRET_KEY: z.string().optional().describe(
        "Secret key used to authenticate with the Stripe API."
    ),

    /** Secret token used to validate incoming Stripe webhooks. */
    STRIPE_WEBHOOK_SECRET: z.string().optional().describe(
        "Secret token used to validate incoming Stripe webhooks."
    ),

    /** The token of the Discord bot, used to authenticate with the Discord API (and perform actions on behalf of the bot, such as sending messages, updating the linked roles schema, etc.). */
    DISCORD_BOT_TOKEN: z.string().describe(
        "The token of the Discord bot, used to authenticate with the Discord API (and perform actions on behalf of the bot, such as sending messages, updating the linked roles schema, etc.)."
    ),

    /** The snowflake ID of the Discord application, used primarily for OAuth. */
    DISCORD_CLIENT_ID: z.string().refine(value => {try {BigInt(value); return true;} catch {return false;}}, {
        message: "DISCORD_CLIENT_ID must be a Discord snowflake",
    }).describe(
        "The snowflake ID of the Discord application, used primarily for OAuth."
    ),

    /** The secret key of the Discord application, used primarily for OAuth. */
    DISCORD_CLIENT_SECRET: z.string().describe(
        "The secret key of the Discord application, used primarily for OAuth."
    ),

    /** The public key of the Discord application, used to validate incoming interaction payloads. */
    DISCORD_APPLICATION_PUBLIC_KEY: z.string().describe(
        "The public key of the Discord application, used to validate incoming interaction payloads."
    ),

    /** The URL of the Discord bot's web server. For local development, you do not need to run these projects in parallel. */
    BOT_URL: z.string().refine(value => URL.canParse(value), {
        message: "BOT_URL must be a valid URL",
    }).describe(
        "The URL of the Discord bot's web server. For local development, you do not need to run these projects in parallel."
    ),

    /** The URL of the Next.js site. For local development, you do not need to run these projects in parallel. */
    NEXTAUTH_URL: z.string().refine(value => URL.canParse(value), {
        message: "NEXTAUTH_URL must be a valid URL",
    }).describe(
        "The URL of the Next.js site. For local development, you do not need to run these projects in parallel."
    ),

    /** The URL of the signup page of the Next.js site. For local development, you do not need to run these projects in parallel. */
    SIGNUP_URL: z.string().refine(value => URL.canParse(value), {
        message: "SIGNUP_URL must be a valid URL",
    }).optional().describe(
        "The URL of the signup page of the Next.js site. For local development, you do not need to run these projects in parallel."
    ),

    /** The secret key used to sign JWTs by next-auth. */
    NEXTAUTH_SECRET: z.string().optional().describe(
        "The secret key used to sign JWTs by next-auth."
    ),

    /** The snowflake IDs of the Discord server(s) the bot considers \ */
    DROPOUT_DEGENS_SERVER_IDS: z.string().transform(value => value.split(",").map(id => id.trim())).refine((arr): arr is [`${bigint}`, ...`${bigint}`[]] => arr.length > 0 && arr.every(id => { try {BigInt(id); return true;} catch {return false;}}), {
        message: "DROPOUT_DEGENS_SERVER_IDS must be a comma-separated list of Discord snowflakes",
    }).optional().describe(
        "The snowflake IDs of the Discord server(s) the bot considers \"our servers\". Used to expose certain features to only those servers."
    ),

    /** The snowflake IDs of the Discord channel(s) the bot will send /weekly-reward prize announcements to. */
    DROPOUT_DEGENS_REWARDS_FEED_CHANNELS: z.string().transform(value => value.split(",").map(id => id.trim())).refine(value => value.every(id => { try {BigInt(id); return true;} catch {return false;}}), {
        message: "DROPOUT_DEGENS_REWARDS_FEED_CHANNELS must be a comma-separated list of Discord snowflakes",
    }).refine((arr): arr is [string, ...string[]] => arr.length > 0, { message: "DROPOUT_DEGENS_REWARDS_FEED_CHANNELS, when defined, must contain at least one snowflake value" }).optional().describe(
        "The snowflake IDs of the Discord channel(s) the bot will send /weekly-reward prize announcements to."
    ),

    /** The snowflake IDs of the Discord channel(s) the bot will send audit log messages to. */
    DISCORD_AUDIT_LOG_CHANNELS: z.string().transform(value => value.split(",").map(id => id.trim())).refine(value => value.every(id => { try {BigInt(id); return true;} catch {return false;}}), {
        message: "DISCORD_AUDIT_LOG_CHANNELS must be a comma-separated list of Discord snowflakes",
    }).refine((arr): arr is [string, ...string[]] => arr.length > 0, { message: "DISCORD_AUDIT_LOG_CHANNELS, when defined, must contain at least one snowflake value" }).optional().describe(
        "The snowflake IDs of the Discord channel(s) the bot will send audit log messages to."
    ),

    /** The snowflake IDs of the Discord channel(s) where the bot will reward Karma to anyone who adds a reaction to a message. */
    DROPOUT_DEGENS_KARMA_REACTION_CHANNELS: z.string().transform(value => value.split(",").map(id => id.trim())).refine(value => value.every(id => { try {BigInt(id); return true;} catch {return false;}}), {
        message: "DROPOUT_DEGENS_KARMA_REACTION_CHANNELS must be a comma-separated list of Discord snowflakes",
    }).refine((arr): arr is [string, ...string[]] => arr.length > 0, { message: "DROPOUT_DEGENS_KARMA_REACTION_CHANNELS, when defined, must contain at least one snowflake value" }).optional().describe(
        "The snowflake IDs of the Discord channel(s) where the bot will reward Karma to anyone who adds a reaction to a message."
    ),

    /** The snowflake IDs of the Discord channel(s) the bot will send premium announcements to, such as when a new user subscribes. */
    PREMIUM_ANNOUNCEMENT_CHANNELS: z.string().transform(value => value.split(",").map(id => id.trim())).refine(value => value.every(id => { try {BigInt(id); return true;} catch {return false;}}), {
        message: "PREMIUM_ANNOUNCEMENT_CHANNELS must be a comma-separated list of Discord snowflakes",
    }).refine((arr): arr is [string, ...string[]] => arr.length > 0, { message: "PREMIUM_ANNOUNCEMENT_CHANNELS, when defined, must contain at least one snowflake value" }).optional().describe(
        "The snowflake IDs of the Discord channel(s) the bot will send premium announcements to, such as when a new user subscribes."
    ),

    /** A link to the Discord channel which contains user-facing information about the Karma system. */
    KARMA_CHANNEL_LINK: z.string().refine(value => URL.canParse(value) && /https:\/\/discord\.com\/channels\/\d+\/\d+/.test(value), {
        message: "KARMA_CHANNEL_LINK must be a valid Discord channel link (e.g. https://discord.com/channels/1088175259565432883/1175998815669592094)",
    }).optional().describe(
        "A link to the Discord channel which contains user-facing information about the Karma system."
    ),

    /** Invite link to the Discord server. May be used in the frontend website. */
    NEXT_PUBLIC_DISCORD_INVITE: z.string().refine(value => URL.canParse(value), {
        message: "NEXT_PUBLIC_DISCORD_INVITE must be a valid URL",
    }).optional().describe(
        "Invite link to the Discord server. May be used in the frontend website."
    ),

    /** Google Cloud Project ID for services such as logging */
    GOOGLE_CLOUD_PROJECT_ID: z.string().optional().describe(
        "Google Cloud Project ID for services such as logging"
    ),




    /** API key used to authenticate with the WHOP API. Because Whop does not provide a staging/testing environment, only BellCube should have this key. */
    WHOP_API_KEY: z.string().optional().describe(
        "API key used to authenticate with the WHOP API. Because Whop does not provide a staging/testing environment, only BellCube should have this key."
    ),

    /** Secret token used to validate incoming Whop webhooks. Because Whop does not provide a staging/testing environment, only BellCube should have this key. */
    WHOP_WEBHOOK_SECRET: z.string().optional().describe(
        "Secret token used to validate incoming Whop webhooks. Because Whop does not provide a staging/testing environment, only BellCube should have this key."
    ),

    /** API key used to authenticate with Random.org for random number generation. */
    RANDOM_ORG_API_KEY: z.string().optional().describe(
        "API key used to authenticate with Random.org for random number generation."
    ),
} as const satisfies z.ZodRawShape



// NOTE: Only works when .optional() is the last modifying method called on the zod object
type OptionalKeysFromEnvSchema = {
    [K in keyof typeof envSchemaRawObject]: typeof envSchemaRawObject[K] extends z.ZodOptional<any> ? K : never;
}[keyof typeof envSchemaRawObject];


// defining the ZodObject like this allows us to get documentation comments in the emitted type declarations
//
// Otherwise, TypeScript would resolve the types of the input and output objects and output them as literals WITHOUT documentation comments
export const envSchema: z.ZodObject<typeof envSchemaRawObject> = z.object(envSchemaRawObject);


type EnvBase = z.infer<typeof envSchema>;

type ModdedEnv<T extends EnvBase> = T & typeof process.env

type Env = ModdedEnv<EnvBase>;

declare global {
    let ___env___parsed___: Env | null;
}

/**
 * Parses and validates the environment variables found in `process.env`, optionally enforcing a set of required keys.
 *
 * @param requiredKeys An array of previously-optional keys in the schema to enforce as required. This is in addition to the required keys already in the schema.
 */
export function getEnv<TRequiredKeys extends [OptionalKeysFromEnvSchema, ...OptionalKeysFromEnvSchema[]]>(requiredKeys: TRequiredKeys): Env & (typeof requiredKeys extends never[] ? never : typeof requiredKeys extends (infer T extends OptionalKeysFromEnvSchema)[] ? Required<Pick<EnvBase, T>> : never)
export function getEnv(requiredKeys?: undefined): Env
export function getEnv<TRequiredKeys extends [OptionalKeysFromEnvSchema, ...OptionalKeysFromEnvSchema[]]>(requiredKeys: TRequiredKeys | never[] = []): Env & (typeof requiredKeys extends (infer T extends OptionalKeysFromEnvSchema)[] ? Required<Pick<EnvBase, T>> : never) {
    const moddedSchema = requiredKeys.length === 0
        ? envSchema as unknown as z.ZodType<EnvBase & (typeof requiredKeys extends (infer T extends OptionalKeysFromEnvSchema)[] ? Required<Pick<EnvBase, T>> : never)>
        : envSchema.merge(z.object(
            Object.fromEntries(requiredKeys.map(  key => [key, envSchemaRawObject[key].unwrap()]  ))
        )) as unknown as z.ZodType<EnvBase & (typeof requiredKeys extends (infer T extends OptionalKeysFromEnvSchema)[] ? Required<Pick<EnvBase, T>> : never)>;

    const parsedEnv = moddedSchema.safeParse(process.env);

    if (parsedEnv.error) {
        parsedEnv.error.errors.forEach(error => {
            const firstKey = error.path[0] as keyof typeof envSchemaRawObject;
            if (!firstKey) return;
            if (!(firstKey in envSchemaRawObject)) {
                return console.warn("Found an invalid path part while parsing ENV variable parsing errors:", firstKey);
            }

            (error as typeof error & {variable: string}).variable = firstKey;
            (error as typeof error & {variable_description?: string}).variable_description = envSchemaRawObject[firstKey].description;
        });

        throw new Error(`Invalid ENV variables: ${inspect(parsedEnv.error.errors, {
            depth: null,
            breakLength: Infinity,
            compact: false,
        })}`);
    }

    return Object.assign({}, process.env, parsedEnv.data);
}

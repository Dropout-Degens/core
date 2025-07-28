import z from "zod/v4";

/**
 * This file ensures our environment variables remain standard, readable, and strictly-enforced at a high level.
 *
 * It includes a utility for parsing and validating environment variables with per-project required props.
 *
 */

// Important note: z.object() allows for extra properties BUT strips them at runtime

function commaSeparatedListOf<T>(itemSchema: z.ZodType<T, string>) {
    return z.string().transform(value => value.split(",").map(item => item.trim())).pipe(z.array(itemSchema)).refine(arr => arr.length > 0, { message: "Comma-separated list must contain at least one item" });
}

const envSchemaRawObject = {

    /** The environment the app is running in. This is used to determine the behavior of the app in situations like logging, whether to enable debug features, and so on. */
    NODE_ENV: z.enum(["production", "testing", "development"]).default("development").describe(
        "The environment the app is running in. This is used to determine the behavior of the app in situations like logging, whether to enable debug features, and so on."
    ),

    /** The port the app will listen on. */
    PORT: z.coerce.number().int().default(3000).describe(
        "The port the app will listen on."
    ),

    /** The URL of the PostgreSQL database to connect to. */
    DATABASE_URL: z.url().refine(value => value.startsWith("postgresql://") || value.startsWith("postgres://"), {
        message: "DATABASE_URL must be a valid PostgreSQL URL",
    }).describe(
        "The URL of the PostgreSQL database to connect to."
    ),

    /** The URL of the PostgreSQL database to connect to for making changes to the database schema. For local development, this is the same as DATABASE_URL. */
    DATABASE_DIRECT_URL: z.url().refine(value => value.startsWith("postgresql://") || value.startsWith("postgres://"), {
        message: "DATABASE_DIRECT_URL must be a valid PostgreSQL URL",
    }).describe(
        "The URL of the PostgreSQL database to connect to for making changes to the database schema. For local development, this is the same as DATABASE_URL."
    ),

    /** The URL of the Supabase instance to connect to. */
    SUPABASE_URL: z.url().describe(
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
    DISCORD_CLIENT_ID: z.templateLiteral([z.bigint()]).describe(
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
    BOT_URL: z.url().describe(
        "The URL of the Discord bot's web server. For local development, you do not need to run these projects in parallel."
    ),

    /** The URL of the Next.js site. For local development, you do not need to run these projects in parallel. */
    NEXTAUTH_URL: z.url().describe(
        "The URL of the Next.js site. For local development, you do not need to run these projects in parallel."
    ),

    /** The URL of the signup page of the Next.js site. For local development, you do not need to run these projects in parallel. */
    SIGNUP_URL: z.url().optional().describe(
        "The URL of the signup page of the Next.js site. For local development, you do not need to run these projects in parallel."
    ),

    /** The secret key used to sign JWTs by next-auth. */
    NEXTAUTH_SECRET: z.string().optional().describe(
        "The secret key used to sign JWTs by next-auth."
    ),

    /** The snowflake IDs of the Discord server(s) the bot considers \ */
    DROPOUT_DEGENS_SERVER_IDS: commaSeparatedListOf(z.templateLiteral([z.bigint()])).optional().describe(
        "The snowflake IDs of the Discord server(s) the bot considers \"our servers\". Used to expose certain features to only those servers."
    ),

    /** The snowflake IDs of the Discord channel(s) the bot will send /weekly-reward prize announcements to. */
    DROPOUT_DEGENS_REWARDS_FEED_CHANNELS: commaSeparatedListOf(z.templateLiteral([z.bigint()])).optional().describe(
        "The snowflake IDs of the Discord channel(s) the bot will send /weekly-reward prize announcements to."
    ),

    /** The snowflake IDs of the Discord channel(s) the bot will send audit log messages to. */
    DISCORD_AUDIT_LOG_CHANNELS: commaSeparatedListOf(z.templateLiteral([z.bigint()])).optional().describe(
        "The snowflake IDs of the Discord channel(s) the bot will send audit log messages to."
    ),

    /** The snowflake IDs of the Discord channel(s) where the bot will reward Karma to anyone who adds a reaction to a message. */
    DROPOUT_DEGENS_KARMA_REACTION_CHANNELS: commaSeparatedListOf(z.templateLiteral([z.bigint()])).optional().describe(
        "The snowflake IDs of the Discord channel(s) where the bot will reward Karma to anyone who adds a reaction to a message."
    ),

    /** The snowflake IDs of the Discord channel(s) the bot will send premium announcements to, such as when a new user subscribes. */
    PREMIUM_ANNOUNCEMENT_CHANNELS: commaSeparatedListOf(z.templateLiteral([z.bigint()])).optional().describe(
        "The snowflake IDs of the Discord channel(s) the bot will send premium announcements to, such as when a new user subscribes."
    ),

    /** A link to the Discord channel which contains user-facing information about the Karma system. */
    KARMA_CHANNEL_LINK: z.url().refine(value => /https:\/\/discord\.com\/channels\/\d+\/\d+/.test(value), {
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

    /** The JWT (credential JSON) for a Google Cloud service account to use when editing spreadsheets. If you do not have a service account credential, you may use the value `no-auth` instead. This will disable spreadsheet-based features. */
    GOOGLE_SPREADSHEET_ACCOUNT_AUTH: z.string().describe(
        "The JWT (credential JSON) for a Google Cloud service account to use when editing spreadsheets. If you do not have a service account credential, you may use the value `no-auth` instead. This will disable spreadsheet-based features.",
    ).transform(value => {
        if (value === "no-auth") return null;
        return value;
    }).refine(value => {
        if (value === null) return true;
        return value.startsWith("auth__");
    }, { message: "GOOGLE_SPREADSHEET_ACCOUNT_AUTH must either be the literal value 'no-auth' or a base64-encoded Google Cloud Service Account JWT" })
    .transform(value => {
        if (value === null) return null;
        let decoded: string;

        try {
            const base64 = value.slice(6);
            decoded = Buffer.from(base64, "base64").toString("utf-8");
        } catch (e) {
            console.error("GOOGLE_SPREADSHEET_ACCOUNT_AUTH:", {value});
            throw new Error("GOOGLE_SPREADSHEET_ACCOUNT_AUTH must be a base64-encoded string");
        }

        try {
            return JSON.parse(decoded)
        } catch (e) {
            console.error("GOOGLE_SPREADSHEET_ACCOUNT_AUTH:", {decoded});
            throw new Error("GOOGLE_SPREADSHEET_ACCOUNT_AUTH must be a valid JSON string")
        }
    }).pipe(z.union([z.null(), z.object({
        type: z.literal("service_account"),
        client_email: z.string(),
        private_key: z.string(),
        private_key_id: z.string(),
        project_id: z.string(),
        client_id: z.string(),
        universe_domain: z.literal("googleapis.com"),
    }, {message: "GOOGLE_SPREADSHEET_ACCOUNT_AUTH must be a valid Google Cloud Service Account JWT"})])).optional(),
    /** The ID of the Google Spreadsheet to use for EV alerts. This is used to store the EV alerts in a spreadsheet. */
    GOOGLE_SPREADSHEET_EV_ALERTS_ID: z.string().optional().describe(
        "The ID of the Google Spreadsheet to use for EV alerts. This is used to store the EV alerts in a spreadsheet."
    ),
    /** For the spreadsheet specified by GOOGLE_SPREADSHEET_EV_ALERTS_ID, this is the range to insert EV alerts into. Typically, you'll want a value like "'test - ALL ALERTS'!A:A" */
    GOOGLE_SPREADSHEET_EV_ALERTS_RANGE: z.string().optional().describe(
        `For the spreadsheet specified by GOOGLE_SPREADSHEET_EV_ALERTS_ID, this is the range to insert EV alerts into. Typically, you'll want a value like "'test - ALL ALERTS'!A:A"`
    ),
    /** Discord channel to send all EV messages to. Used for debugging & testing purposes. */
    EV_DEBUG_CHANNEL_ID: z.templateLiteral([z.bigint()]).optional().describe(
        "Discord channel to send all EV messages to. Used for debugging & testing purposes."
    ),
    /** Discord channel located in the first item of DROPOUT_DEGENS_SERVER_IDS where Placed EV Bets threads will be created */
    PLACED_EV_BETS_THREAD_CHANNEL_ID: z.templateLiteral([z.bigint()]).optional().describe(
        "Discord channel in the first item of DROPOUT_DEGENS_SERVER_IDS where Placed EV Bets threads will be created"
    ),

    DROPOUT_DEGENS_WELCOME_TICKET_INVITE_CODES: commaSeparatedListOf(z.string()).transform(value => new Set(value)).optional().describe(
        "A set of invite codes that can be used to create welcome tickets. If a user did not join the server using one of these invite codes, a welcome ticket will not be created for them. This makes welcome tickets more manageable."
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
        throw new Error(`Invalid ENV variables: ${z.prettifyError(parsedEnv.error)}`);
    }

    return Object.assign({}, process.env, parsedEnv.data);
}

export enum RoleFlags {
    //                                          Premium
    //                             Vanity Roles ^^^^^^^^
    //                         Reserved ^^^^^^^^^^^^^^^^
    //              Staff Perms ^^^^^^^^^^^^^^^^^^^^^^^^
    //                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

    /** An admin has so much power they can even change a user's subscription status! */
    Admin           = 0b10000000000000000000000000000000,
    /** Reserved staff flag for potential later use */
    UnknownStaff2   = 0b01000000000000000000000000000000,
    /** Reserved staff flag for potential later use */
    UnknownStaff3   = 0b00100000000000000000000000000000,
    /** Reserved staff flag for potential later use */
    UnknownStaff4   = 0b00010000000000000000000000000000,
    /** Reserved staff flag for potential later use */
    UnknownStaff5   = 0b00001000000000000000000000000000,
    /** Reserved staff flag for potential later use */
    UnknownStaff6   = 0b00000100000000000000000000000000,
    /** Cappers are the people who voice their opinions on who might win a game professionally */
    Capper          = 0b00000010000000000000000000000000,
    /** Staff get this one if they don't fit any other role */
    GenericStaff    = 0b00000001000000000000000000000000,


    /** All of the flags that should be treated as a staff role */
    AnyStaffRole    = 0b11111111000000000000000000000000,


    /** An affiliate of Dropout Degens */
    Degen           = 0b00000000100000000000000000000000,
    /** Generic, reserved flag for potential later use */
    Reserved2       = 0b00000000010000000000000000000000,
    /** Generic, reserved flag for potential later use */
    Reserved3       = 0b00000000001000000000000000000000,
    /** Generic, reserved flag for potential later use */
    Reserved4       = 0b00000000000100000000000000000000,
    /** Generic, reserved flag for potential later use */
    Reserved5       = 0b00000000000010000000000000000000,
    /** Generic, reserved flag for potential later use */
    Reserved6       = 0b00000000000001000000000000000000,
    /** Generic, reserved flag for potential later use */
    Reserved7       = 0b00000000000000100000000000000000,
    /** Generic, reserved flag for potential later use */
    Reserved8       = 0b00000000000000010000000000000000,

    /** Someone who pays $50/year just to have a fancy name and some extra Karma. What a sucker. */
    Van_HighRoller  = 0b00000000000000001000000000000000,
    /** Reserved vanity role flag for potential later use */
    VanityRole2     = 0b00000000000000000100000000000000,
    /** Reserved vanity role flag for potential later use */
    VanityRole3     = 0b00000000000000000010000000000000,
    /** Reserved vanity role flag for potential later use */
    VanityRole4     = 0b00000000000000000001000000000000,
    /** Reserved vanity role flag for potential later use */
    VanityRole5     = 0b00000000000000000000100000000000,
    /** Reserved vanity role flag for potential later use */
    VanityRole6     = 0b00000000000000000000010000000000,
    /** Reserved vanity role flag for potential later use */
    VanityRole7     = 0b00000000000000000000001000000000,
    /** Reserved vanity role flag for potential later use */
    VanityRole8     = 0b00000000000000000000000100000000,

    /** The flag for Player Props players */
    PlayerPropsRaw  = 0b00000000000000000000000000000010,
    /** All of the flags that should be treated as Player Props */
    PlayerProps     = 0b11111111000000000000000000000010,
    /** The flag for Sportsbook players */
    SportsbookRaw   = 0b00000000000000000000000000000001,
    /** All of the flags that should be treated as Sportsbook */
    Sportsbook      = 0b11111111000000000000000000000001,
    /** Reserved premium role flag for potential later use */
    PremiumRole3    = 0b00000000000000000010000000000000,
    /** Reserved premium role flag for potential later use */
    PremiumRole4    = 0b00000000000000000001000000000000,
    /** Reserved premium role flag for potential later use */
    PremiumRole5    = 0b00000000000000000000100000000000,
    /** Reserved premium role flag for potential later use */
    PremiumRole6    = 0b00000000000000000000010000000000,
    /** Reserved premium role flag for potential later use */
    PremiumRole7    = 0b00000000000000000000001000000000,
    /** Reserved premium role flag for potential later use */
    PremiumRole8    = 0b00000000000000000000000100000000,

    /** The two flags for All Access players */
    AllAccessRaw    = 0b00000000000000000000000000000011,
    /** All of the flags that should be treated as All Access */
    AllAccess       = 0b11111111000000000000000000000011,

    /** All of the flags that should be treated as a Premium user */
    AnyPremiumRole  = 0b11111111000000000000000011111111,
}

export default RoleFlags;

export enum KarmaPerMessageByRole {
    _DEFAULT = 0.25,
    AllAccessRaw    = 1,
    Van_HighRoller  = 2,
    AnyStaffRole    = 2,
}

export enum KarmaMaxByMessagePerDayByRole {
    _DEFAULT = 25,
    AllAccessRaw = 125,
    Van_HighRoller = 250,
    AnyStaffRole = 500,
}

export enum KarmaPerDayByRole {
    _DEFAULT = 0,
    AllAccessRaw = 10,
    Van_HighRoller = 25,
}

export enum PurchasablePlan {
    Van_HighRoller = RoleFlags.Van_HighRoller,
    AllAccess = RoleFlags.AllAccessRaw,
    PlayerProps = RoleFlags.PlayerPropsRaw,
    Sportsbook = RoleFlags.SportsbookRaw,
    Any = RoleFlags.Van_HighRoller | RoleFlags.AllAccessRaw | RoleFlags.PlayerPropsRaw | RoleFlags.SportsbookRaw
}

export enum DiscountSource {
    ['weekly-reward'] = 'weekly-reward',
    manual = 'manual'
}

export type DiscountGroups = Record<PurchasablePlan, Discounts>;

export enum BillingPeriod {
    year = 'year',
    months3 = 'months3',
    months1 = 'months1',
    weekly = 'weekly',
    daily = 'daily'
}

/** Represents a single coupon */
export interface CouponDefinition {
    /** Number multiplied against the price to determine how much should be waived (e.g. a 75% discount would be 0.75) */
    amount: number;

    /** The type of subscription this coupon is applicable to */
    planType: Exclude<PurchasablePlan, PurchasablePlan.Any>;

    /** The billing period this coupon should apply to */
    billingPeriod: BillingPeriod;

    /** How many billing periods this coupon lasts for */
    duration: number;

    /** The promo code string used for Whop
     *
     * Schema:
     * ${Snowflake}-${PseudoRandomFillTo40Chars}-${BillingPeriod}-${Duration}-${Amount}
    */
    promoCode?: string;

    /** Where the coupon was obtained from */
    source: DiscountSource;
}

export interface CouponGenerated extends CouponDefinition {
    promoCode: string;
}

export type Coupon<TGenerated extends boolean = false> = TGenerated extends true ? CouponGenerated : CouponDefinition;


/** A list of discounts applicable to a given subscription type */
export interface Discounts {
    /** How many days the user has for free in this tier
     *
     * Organized by the source of the discount
    */
    free: Partial<Record<DiscountSource, number>>;
    /** A list of coupons for this tier in this customer's arsenal */
    coupons: Coupon<true>[];
}

export type UsersDiscount = Partial<Record<PurchasablePlan, Discounts>>;

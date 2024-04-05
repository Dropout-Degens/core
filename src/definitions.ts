import { coupon } from "@prisma/client";

export enum RoleFlags {
    //                                            Premium
    //                               Vanity Roles ^^^^^^^^
    //                           Reserved ^^^^^^^^^^^^^^^^
    //                Staff Perms ^^^^^^^^^^^^^^^^^^^^^^^^
    //                    -^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    AllRoles =          0b1111111111111111111111111111111,

    /** An admin has so much power they can even change a user's subscription status! */
    Admin             = 0b1000000000000000000000000000000,
    /** Reserved staff flag for potential later use */
    UnknownStaff2     = 0b0100000000000000000000000000000,
    /** Reserved staff flag for potential later use */
    Developer         = 0b0010000000000000000000000000000,
    /** A moderator of Dropout Degens */
    Moderator         = 0b0001000000000000000000000000000,
    /** An affiliate of Dropout Degens */
    Degen             = 0b0000100000000000000000000000000,
    /** Cappers are the people who voice their opinions on who might win a game professionally */
    Capper            = 0b0000010000000000000000000000000,
    /** Staff get this one if they don't fit any other role */
    GenericStaff      = 0b0000001000000000000000000000000,


    /** All of the flags that should be treated as a staff role */
    AnyStaffRole      = 0b1111111000000000000000000000000,


    /** Generic, reserved flag for potential later use */
    Reserved1         = 0b0000000100000000000000000000000,
    /** Generic, reserved flag for potential later use */
    Reserved2         = 0b0000000010000000000000000000000,
    /** Generic, reserved flag for potential later use */
    Reserved3         = 0b0000000001000000000000000000000,
    /** Generic, reserved flag for potential later use */
    Reserved4         = 0b0000000000100000000000000000000,
    /** Generic, reserved flag for potential later use */
    Reserved5         = 0b0000000000010000000000000000000,
    /** Generic, reserved flag for potential later use */
    Reserved6         = 0b0000000000001000000000000000000,
    /** Generic, reserved flag for potential later use */
    Reserved7         = 0b0000000000000100000000000000000,
    /** Generic, reserved flag for potential later use */
    Reserved8         = 0b0000000000000010000000000000000,

    /** All of the flags that should be treated as one of the reserved roles */
    AnyReservedRole   = 0b0000000111111110000000000000000,

    /** Someone who pays $50/year just to have a fancy name and some extra Karma. What a sucker. */
    Van_HighRoller    = 0b0000000000000001000000000000000,
    /** Reserved vanity role flag for potential later use */
    VanityRole2       = 0b0000000000000000100000000000000,
    /** Reserved vanity role flag for potential later use */
    VanityRole3       = 0b0000000000000000010000000000000,
    /** Reserved vanity role flag for potential later use */
    VanityRole4       = 0b0000000000000000001000000000000,
    /** Reserved vanity role flag for potential later use */
    VanityRole5       = 0b0000000000000000000100000000000,
    /** Reserved vanity role flag for potential later use */
    VanityRole6       = 0b0000000000000000000010000000000,
    /** Reserved vanity role flag for potential later use */
    VanityRole7       = 0b0000000000000000000001000000000,
    /** Reserved vanity role flag for potential later use */
    VanityRole8       = 0b0000000000000000000000100000000,

    /** All of the flags that should be treated as a vanity role */
    AnyVanityRole     = 0b0000000000000001111111100000000,

    /** The flag for Player Props players */
    PlayerPropsRaw    = 0b0000000000000000000000000000010,
    /** All of the flags that should be treated as Player Props */
    PlayerProps       = 0b1111111000000000000000000000010,
    /** The flag for Sportsbook players */
    SportsbookRaw     = 0b0000000000000000000000000000001,
    /** All of the flags that should be treated as Sportsbook */
    Sportsbook        = 0b1111111000000000000000000000001,
    /** Reserved premium role flag for potential later use */
    PremiumRole3      = 0b0000000000000000000000010000000,
    /** Reserved premium role flag for potential later use */
    PremiumRole4      = 0b0000000000000000000000001000000,
    /** Reserved premium role flag for potential later use */
    PremiumRole5      = 0b0000000000000000000000000100000,
    /** Reserved premium role flag for potential later use */
    PremiumRole6      = 0b0000000000000000000000000010000,
    /** Reserved premium role flag for potential later use */
    PremiumRole7      = 0b0000000000000000000000000001000,
    /** Reserved premium role flag for potential later use */
    PremiumRole8      = 0b0000000000000000000000000000100,

    /** The two flags for All Access players */
    AllAccessRaw      = 0b0000000000000000000000000000011,
    /** All of the flags that should be treated as All Access */
    AllAccess         = 0b1111111000000000000000000000011,

    /** All of the flags that should be treated as a Premium user */
    AnyPremiumRole    = 0b1111111000000000000000011111111,
    /** All of the flags that should be treated as a Premium user WITHOUT staff flags */
    AnyPremiumRoleRaw = 0b0000000000000000000000011111111,
}

export default RoleFlags;

export enum KarmaPerMessageByRole {
    _any        = 5,
    AnyPremiumRole  = 10,
    Van_HighRoller  = 25,
    AnyStaffRole    = 10,
}

export enum KarmaPerMessageDailyCapByRole {
    _any        = 500,
    AnyPremiumRole  = 1250,
    Van_HighRoller  = 2500,
    AnyStaffRole    = -1,
}

export enum KarmaPerReactionByRole {
    _any = 5,
}

export enum KarmaPerReactionDailyCapByRole {
    _any = 25,
}

export enum KarmaDailyBonusByRole {
    _any = 0,
    AnyPremiumRole = 250,
    Van_HighRoller = 500,
    AnyStaffRole = 0,
}

export enum PurchasablePlan {
    Van_HighRoller = RoleFlags.Van_HighRoller,
    AllAccess = RoleFlags.AllAccessRaw,
    Any = RoleFlags.Van_HighRoller | RoleFlags.AllAccessRaw,
}

export enum DiscountSource {
    ['weekly-reward'] = 'weekly-reward',
    manual = 'manual'
}

export enum BillingPeriod {
    year = 'year',
    months3 = 'months3',
    months1 = 'months1',
    weekly = 'weekly',
}

/** Represents a single coupon. More specific type definitions than Prisma allows. */
export interface CouponDefinition extends Omit<Omit<coupon, 'promo_code'|'whop_id'|'stripe_id'> & Partial<Pick<coupon, 'promo_code'|'whop_id'|'stripe_id'>>, never> {
    /** The type of subscription this coupon is applicable to */
    plan_type: Exclude<PurchasablePlan, PurchasablePlan.Any>;

    /** The billing period this coupon should apply to */
    billing_period: BillingPeriod;

    /** Where the coupon was obtained from */
    source: DiscountSource;
}

export interface CouponGenerated<TUsesStripe extends boolean = false, TUsesWhop extends boolean = true> extends Omit<CouponDefinition & coupon, never> {
    whop_id: TUsesWhop extends true ? NonNullable<coupon['whop_id']> : coupon['whop_id'];
    stripe_id: TUsesStripe extends true ? NonNullable<coupon['stripe_id']>: coupon['stripe_id'];
    promo_code: string;
}

export type Coupon<TGenerated extends boolean = false, TUsesStripe extends boolean = false, TUsesWhop extends boolean = true> = TGenerated extends true ? CouponGenerated<TUsesStripe, TUsesWhop> : CouponDefinition;

export type PlanFreeDays = Partial<Record<DiscountSource, number>>;
export type FreeDays = Partial<Record<PurchasablePlan, PlanFreeDays>>;




/** Represents a single coupon */
//export interface CouponDefinition {
//    /** Number multiplied against the price to determine how much should be waived (e.g. a 75% discount would be 0.75) */
//    amount: number;
//
//    /** The type of subscription this coupon is applicable to */
//    planType: Exclude<PurchasablePlan, PurchasablePlan.Any>;
//
//    /** The billing period this coupon should apply to */
//    billingPeriod: BillingPeriod;
//
//    /** How many billing periods this coupon lasts for */
//    duration: number;
//
//    /** The promo code string used for Whop
//     *
//     * Schema:
//     * ${Snowflake}-${PseudoRandomFillTo40Chars}-${BillingPeriod}-${Duration}-${Amount}
//    */
//    promoCode?: string;
//
//    /** Where the coupon was obtained from */
//    source: DiscountSource;
//}

//export interface CouponGenerated extends CouponDefinition {
//    promoCode: string;
//}

//export type Coupon<TGenerated extends boolean = false> = TGenerated extends true ? CouponGenerated : CouponDefinition;


/** A list of discounts applicable to a given subscription type */
//export interface Discounts {
//    /** How many days the user has for free in this tier
//     *
//     * Organized by the source of the discount
//    */
//    free: Partial<Record<DiscountSource, number>>;
//    /** A list of coupons for this tier in this customer's arsenal */
//    coupons: Coupon<true>[];
//}

//export type UsersDiscount = Partial<Record<PurchasablePlan, Discounts>>;

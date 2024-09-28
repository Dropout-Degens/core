import { coupon } from "@prisma/client";

export enum RoleFlags {
    //                                               Premium
    //                                      Vanity  ^^^^^^^^
    //                            Reserved ^^^^^^^^ ^^^^^^^^
    //                     Staff  ^^^^^^^^ ^^^^^^^^ ^^^^^^^^
    //                    ^^^^^^^ ^^^^^^^^ ^^^^^^^^ ^^^^^^^^
    AllRoles =          0b1111111_11111111_11111111_11111111,

    /** An admin has so much power they can even change a user's subscription status! */
    Admin             = 0b1000000_00000000_00000000_00000000,
    /** Reserved staff flag for potential later use */
    UnknownStaff2     = 0b0100000_00000000_00000000_00000000,
    /** Reserved staff flag for potential later use */
    Developer         = 0b0010000_00000000_00000000_00000000,
    /** A moderator of Dropout Degens */
    Moderator         = 0b0001000_00000000_00000000_00000000,
    /** An affiliate of Dropout Degens */
    Degen             = 0b0000100_00000000_00000000_00000000,
    /** Cappers are the people who voice their opinions on who might win a game professionally */
    Capper            = 0b0000010_00000000_00000000_00000000,
    /** Staff get this one if they don't fit any other role */
    GenericStaff      = 0b0000001_00000000_00000000_00000000,


    /** All of the flags that should be treated as a staff role */
    AnyStaffRole      = 0b1111111_00000000_00000000_00000000,


    /** Generic, reserved flag for potential later use */
    Reserved1         = 0b0000000_10000000_00000000_00000000,
    /** Generic, reserved flag for potential later use */
    Reserved2         = 0b0000000_01000000_00000000_00000000,
    /** Generic, reserved flag for potential later use */
    Reserved3         = 0b0000000_00100000_00000000_00000000,
    /** Generic, reserved flag for potential later use */
    Reserved4         = 0b0000000_00010000_00000000_00000000,
    /** Generic, reserved flag for potential later use */
    Reserved5         = 0b0000000_00001000_00000000_00000000,
    /** Generic, reserved flag for potential later use */
    Reserved6         = 0b0000000_00000100_00000000_00000000,
    /** Generic, reserved flag for potential later use */
    Reserved7         = 0b0000000_00000010_00000000_00000000,
    /** Generic, reserved flag for potential later use */
    Reserved8         = 0b0000000_00000001_00000000_00000000,

    /** All of the flags that should be treated as one of the reserved roles */
    AnyReservedRole   = 0b0000000_11111111_00000000_00000000,

    /** Someone who pays $50/year just to have a fancy name and some extra Karma. What a sucker. */
    Van_HighRoller    = 0b0000000_00000000_10000000_00000000,
    /** Reserved vanity role flag for potential later use */
    VanityRole2       = 0b0000000_00000000_01000000_00000000,
    /** Reserved vanity role flag for potential later use */
    VanityRole3       = 0b0000000_00000000_00100000_00000000,
    /** Reserved vanity role flag for potential later use */
    VanityRole4       = 0b0000000_00000000_00010000_00000000,
    /** Reserved vanity role flag for potential later use */
    VanityRole5       = 0b0000000_00000000_00001000_00000000,
    /** Reserved vanity role flag for potential later use */
    VanityRole6       = 0b0000000_00000000_00000100_00000000,
    /** Reserved vanity role flag for potential later use */
    VanityRole7       = 0b0000000_00000000_00000010_00000000,
    /** Reserved vanity role flag for potential later use */
    VanityRole8       = 0b0000000_00000000_00000001_00000000,

    /** All of the flags that should be treated as a vanity role */
    AnyVanityRole     = 0b0000000_00000000_11111111_00000000,

    /** The flag for Player Props players */
    ExpectedValueRaw  = 0b0000000_00000000_00000000_00000011,
    /** All of the flags that should be treated as Player Props */
    ExpectedValue     = 0b1111111_00000000_00000000_00000011,
    /** The flag for Sportsbook players */
    BettingRaw        = 0b0000000_00000000_00000000_00000000,
    /** All of the flags that should be treated as Sportsbook */
    Betting           = 0b1111111_00000000_00000000_00000000,
    /** Reserved premium role flag for potential later use */
    PremiumRole3      = 0b0000000_00000000_00000000_10000000,
    /** Reserved premium role flag for potential later use */
    PremiumRole4      = 0b0000000_00000000_00000000_01000000,
    /** Reserved premium role flag for potential later use */
    PremiumRole5      = 0b0000000_00000000_00000000_00100000,
    /** Reserved premium role flag for potential later use */
    PremiumRole6      = 0b0000000_00000000_00000000_00010000,
    /** Reserved premium role flag for potential later use */
    PremiumRole7      = 0b0000000_00000000_00000000_00001000,
    /** Reserved premium role flag for potential later use */
    PremiumRole8      = 0b0000000_00000000_00000000_00000100,

    /** The two flags for All Access players */
    AllAccessRaw      = 0b0000000_00000000_00000000_00000011,
    /** All of the flags that should be treated as All Access */
    AllAccess         = 0b1111111_00000000_00000000_00000011,

    /** All of the flags that should be treated as a Premium user */
    AnyPremiumRole    = 0b1111111_00000000_00000000_11111111,
    /** All of the flags that should be treated as a Premium user WITHOUT staff flags */
    AnyPremiumRoleRaw = 0b0000000_00000000_00000000_11111111,
}

export default RoleFlags;

export enum PurchasablePlan {
    Van_HighRoller = RoleFlags.Van_HighRoller,
    AllAccess = RoleFlags.AllAccessRaw,
    Any = RoleFlags.Van_HighRoller | RoleFlags.AllAccessRaw,
}

export enum DiscountSource {
    'weekly-reward' = 'weekly-reward',
    manual = 'manual'
}

/** @deprecated in favor of directly stringifying from Stripe */
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


export type IsNullable<T> = Extract<T, null> extends never ? false : true
export type IsOptional<T> = Extract<T, undefined> extends never ? false : true

export type ZodWithEffects<T extends import('zod').ZodTypeAny> = T | import('zod').ZodEffects<T, unknown, unknown>

export type ToZodSchema<T extends Record<string, any>> = {
  [K in keyof T]-?: IsNullable<T[K]> extends true
    ? ZodWithEffects<import('zod').ZodNullable<import('zod').ZodType<T[K]>>>
    : IsOptional<T[K]> extends true
      ? ZodWithEffects<import('zod').ZodOptional<import('zod').ZodType<T[K]>>>
      : ZodWithEffects<import('zod').ZodType<T[K]>>
}

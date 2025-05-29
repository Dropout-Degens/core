import { BillingPeriod, BankedCoupon, BankedCouponDefinition, BankedCouponGenerated, DiscountSource, PurchasablePlan, FreeDays, PlanFreeDays, type ToZodSchema } from './definitions';
import * as z from 'zod/v4';

//export const validatePurchasableSubscriptionType = oneOf<Exclude<PurchasablePlan, PurchasablePlan.Any>>(Object.values(PurchasablePlan).filter(v => typeof v === 'number' && v !== PurchasablePlan.Any) as Exclude<PurchasablePlan, PurchasablePlan.Any>[]);
export const validatePurchasableSubscriptionType = z.enum(PurchasablePlan).refine(v => v !== PurchasablePlan.Any).pipe(z.custom<Exclude<PurchasablePlan, PurchasablePlan.Any>>());

export const validateBillingPeriod = z.enum(BillingPeriod);

const PromoCodeSchema = z.string().regex(/^\d+-[a-zA-Z0-9]*-[a-zA-Z0-9]+-\d+-[\.0-9]+$/).max(40) as z.ZodType<`${bigint}-${string}-${string}-${bigint}-${number}`>;

export const validateBankedCouponDefinition = z.object({
    discountAmount: z.number().min(0).max(1),
    planType: validatePurchasableSubscriptionType,
    billingPeriod: validateBillingPeriod,
    duration: z.number().min(0),
    promoCode: PromoCodeSchema.optional(),
    source: z.enum(DiscountSource),
    userSnowflake: z.bigint().nullable(),
    stripeId: z.string().nullable(), // may want a more strict validator later
    whopId: z.string().nullable(), // may want a more strict validator later
} satisfies ToZodSchema<BankedCouponDefinition>);


export const validateGeneratedBankedCoupon = z.union([
    validateBankedCouponDefinition.extend({
        promoCode: PromoCodeSchema,
        stripeId: z.null(),
        whopId: z.string(),
    }) satisfies z.ZodType<BankedCouponGenerated<boolean, boolean>, unknown>,

    validateBankedCouponDefinition.extend({
        promoCode: PromoCodeSchema,
        stripeId: z.string(),
        whopId: z.null(),
    }) satisfies z.ZodType<BankedCouponGenerated<boolean, boolean>, unknown>,

    validateBankedCouponDefinition.extend({
        promoCode: PromoCodeSchema,
        stripeId: z.string(),
        whopId: z.string(),
    }) satisfies z.ZodType<BankedCouponGenerated<boolean, boolean>, unknown>
]);

//export const validateGeneratedBankedCouponList = arrayOf<BankedCouponGenerated<false, true> | BankedCouponGenerated<true, false>>(validateGeneratedBankedCoupon);
export const validateBankedCouponDefinitionList = z.array(validateBankedCouponDefinition);

//export const validateBankedCoupon = alternatives<Validator<BankedCoupon<boolean>>[]>([validateBankedCouponDefinition, validateGeneratedBankedCoupon]);
export const validateBankedCoupon = z.union([validateBankedCouponDefinition, validateGeneratedBankedCoupon]);
export const validateBankedCouponList = z.array(validateBankedCoupon);


export const validatePlanPlanFreeDays = z.partialRecord(z.enum(DiscountSource), z.number().int().min(0));

export const validateFreeDays = z.partialRecord(validatePurchasableSubscriptionType, validatePlanPlanFreeDays)

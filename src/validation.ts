import { BillingPeriod, BankedCoupon, BankedCouponDefinition, BankedCouponGenerated, DiscountSource, PurchasablePlan, FreeDays, PlanFreeDays, type ToZodSchema } from './definitions';
import * as z from 'zod';

//export const validatePurchasableSubscriptionType = oneOf<Exclude<PurchasablePlan, PurchasablePlan.Any>>(Object.values(PurchasablePlan).filter(v => typeof v === 'number' && v !== PurchasablePlan.Any) as Exclude<PurchasablePlan, PurchasablePlan.Any>[]);
export const validatePurchasableSubscriptionType = z.nativeEnum(PurchasablePlan).refine(v => v !== PurchasablePlan.Any);

export const validateBillingPeriod = z.nativeEnum(BillingPeriod);

const PromoCodeSchema = z.string().regex(/^\d+-[a-zA-Z0-9]*-[a-zA-Z0-9]+-\d+-[\.0-9]+$/).max(40) as z.ZodType<`${bigint}-${string}-${string}-${bigint}-${number}`>;

export const validateBankedCouponDefinition = z.object({
    discountAmount: z.number().min(0).max(1),
    planType: validatePurchasableSubscriptionType,
    billingPeriod: validateBillingPeriod,
    duration: z.number().min(0),
    promoCode: PromoCodeSchema.optional(),
    source: z.nativeEnum(DiscountSource),
    userSnowflake: z.bigint().nullable(),
    stripeId: z.string().nullable(), // may want a more strict validator later
    whopId: z.string().nullable(), // may want a more strict validator later
} satisfies ToZodSchema<BankedCouponDefinition>);


export const validateGeneratedBankedCoupon = z.union([
    validateBankedCouponDefinition.extend({
        promoCode: PromoCodeSchema,
        stripeId: z.null(),
        whopId: z.string(),
    }) satisfies z.ZodType<BankedCouponGenerated<boolean, boolean>, z.ZodTypeDef, unknown>,

    validateBankedCouponDefinition.extend({
        promoCode: PromoCodeSchema,
        stripeId: z.string(),
        whopId: z.null(),
    }) satisfies z.ZodType<BankedCouponGenerated<boolean, boolean>, z.ZodTypeDef, unknown>,

    validateBankedCouponDefinition.extend({
        promoCode: PromoCodeSchema,
        stripeId: z.string(),
        whopId: z.string(),
    }) satisfies z.ZodType<BankedCouponGenerated<boolean, boolean>, z.ZodTypeDef, unknown>
]);

//export const validateGeneratedBankedCouponList = arrayOf<BankedCouponGenerated<false, true> | BankedCouponGenerated<true, false>>(validateGeneratedBankedCoupon);
export const validateBankedCouponDefinitionList = z.array(validateBankedCouponDefinition);

//export const validateBankedCoupon = alternatives<Validator<BankedCoupon<boolean>>[]>([validateBankedCouponDefinition, validateGeneratedBankedCoupon]);
export const validateBankedCoupon = z.union([validateBankedCouponDefinition, validateGeneratedBankedCoupon]);
export const validateBankedCouponList = z.array(validateBankedCoupon);

//export const validatePlanPlanFreeDays = object<ObjectValidator<PlanFreeDays>>(
//    Object.fromEntries(
//        Object.values(DiscountSource).map(v => [v, optional(int({min: 0}))])
//    ) as ObjectValidator<PlanFreeDays>
//);

export const validatePlanPlanFreeDays = z.record(z.nativeEnum(DiscountSource), z.number().int().min(0).nullable());

//export const validateFreeDays = nullable<FreeDays>(object<ObjectValidator<FreeDays>>(
//    Object.fromEntries(
//        Object.values(PurchasablePlan).filter(v => typeof v === 'number').map(v => [v, optional(validatePlanPlanFreeDays)])
//    ) as ObjectValidator<FreeDays>
//));

export const validateFreeDays = z.record(validatePurchasableSubscriptionType, validatePlanPlanFreeDays.nullable())

import { object, int, oneOf, string, optional, arrayOf, Validator, ValidationError, float, alternatives, exact, nullable } from 'checkeasy';
import { BillingPeriod, Coupon, CouponDefinition, CouponGenerated, DiscountSource, PurchasablePlan, FreeDays, PlanFreeDays } from './definitions.js';

type ObjectValidator<T> = Required<{ [K in keyof T]: Validator<T[K]> }>;

export const validatePurchasableSubscriptionType = oneOf<Exclude<PurchasablePlan, PurchasablePlan.Any>>(Object.values(PurchasablePlan).filter(v => typeof v === 'number' && v !== PurchasablePlan.Any) as Exclude<PurchasablePlan, PurchasablePlan.Any>[]);

export const validateBillingPeriod = oneOf<BillingPeriod>(Object.values(BillingPeriod));

// make able to pass in a validator
export function not<T>(value: T): Validator<T> {
    return function notValidator<V>(v: V, path: string): Exclude<V, T> {
        // @ts-ignore: This logic is completely fine. TypeScript just doesn't get it.
        if (value === v) throw new ValidationError(`[${path}] This value is exactly the value we expected it not to be!`);
        // @ts-ignore: This logic is completely fine. TypeScript just doesn't get it.
        return v;
    }
};

export function bigint(options?: {min?: number|bigint, max?: number|bigint}): Validator<bigint> {
    return function bigintValidator(v: unknown, path: string) {
        if (typeof v !== 'bigint') {
            throw new ValidationError(`[${path}] should be a bigint`);
        }

        if (options?.min && v < options.min) {
            throw new ValidationError(`[${path}] is smaller than the allowed minimum (${options.min})`);
        }
        if (options?.max && v > options.max) {
            throw new ValidationError(`[${path}] is larger than the allowed maximum (${options.max})`);
        }
        return v;
    };
}

const CouponValidatorDefinitions = {
    discount_amount: float({min: 0, max: 1}),
    plan_type: validatePurchasableSubscriptionType,
    billing_period: validateBillingPeriod,
    duration: float({min: 0}),
    promo_code: string({pattern: /^\d+-[a-zA-Z0-9]*-[a-zA-Z0-9]+-\d+-[\.0-9]+$/, max: 40}) as Validator<`${bigint}-${string}-${string}-${bigint}-${number}`>,
    source: oneOf<DiscountSource>(Object.values(DiscountSource)),
    associated_user: nullable(bigint()),
    stripe_id: nullable(string()), // may want a more strict validator later
    whop_id: nullable(string()), // may want a more strict validator later
} satisfies ObjectValidator<CouponDefinition>;


export const validateCouponDefinition: Validator<CouponDefinition> = object<ObjectValidator<CouponDefinition>>(CouponValidatorDefinitions);
export const validateStripeGeneratedCoupon: Validator<CouponGenerated<true, false>> = object<ObjectValidator<CouponGenerated<true, false>>>({
    ...CouponValidatorDefinitions,
    stripe_id: string(),
});
export const validateWhopGeneratedCoupon: Validator<CouponGenerated<false, true>> = object<ObjectValidator<CouponGenerated<false, true>>>({
    ...CouponValidatorDefinitions,
    whop_id: string(),
});
export const validateGeneratedCoupon: Validator<CouponGenerated<false, true> | CouponGenerated<true, false>> = alternatives([
    validateStripeGeneratedCoupon,
    validateWhopGeneratedCoupon,
]);

export const validateCoupon = alternatives<Validator<Coupon<boolean>>[]>([validateCouponDefinition, validateGeneratedCoupon]);
export const validateCouponList = arrayOf<Coupon<boolean>>(validateCoupon);

export const validatePlanPlanFreeDays = object<ObjectValidator<PlanFreeDays>>(
    Object.fromEntries(
        Object.values(DiscountSource).map(v => [v, optional(int({min: 0}))])
    ) as ObjectValidator<PlanFreeDays>
);

export const validateFreeDays = object<ObjectValidator<FreeDays>>(
    Object.fromEntries(
        Object.values(PurchasablePlan).filter(v => typeof v === 'number').map(v => [v, optional(validatePlanPlanFreeDays)])
    ) as ObjectValidator<FreeDays>
);

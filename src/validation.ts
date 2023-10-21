import { object, int, oneOf, string, optional, arrayOf, Validator, ValidationError } from 'checkeasy';
import { BillingPeriod, Coupon, CouponDefinition, CouponGenerated, DiscountSource, Discounts, PurchasablePlan, UsersDiscount } from './definitions.js';

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
const CouponValidatorDefinitions = {
    amount: int({min: 0, max: 1}),
    planType: validatePurchasableSubscriptionType,
    billingPeriod: validateBillingPeriod,
    duration: int({min: 0}),
    promoCode: string({pattern: /^\d+-[a-zA-Z0-9]*-[a-zA-Z0-9]+-\d+-[\.0-9]+$/, max: 40}) as Validator<`${bigint}-${string}-${string}-${bigint}-${number}`>,
    source: oneOf<DiscountSource>([DiscountSource['weekly-reward'], DiscountSource.manual])
} satisfies ObjectValidator<CouponDefinition>;


export const validateCouponDefinition: Validator<CouponDefinition> = object<ObjectValidator<CouponDefinition>>(Object.assign({}, CouponValidatorDefinitions, {promoCode: optional(CouponValidatorDefinitions.promoCode)}));

export const validateGeneratedCoupon: Validator<CouponGenerated> = object<ObjectValidator<CouponGenerated>>(CouponValidatorDefinitions);

export const validateCoupon = oneOf<Validator<Coupon<boolean>>>([validateCouponDefinition, validateGeneratedCoupon]);


export const validateFreeDays= object<ObjectValidator<Discounts['free']>>(
    Object.fromEntries(
        Object.values(DiscountSource).map(v => [v, optional(int({min: 0}))])
    ) as ObjectValidator<Discounts['free']>
);

export const validateDiscounts: Validator<Discounts> = object({
    free: validateFreeDays,
    coupons: arrayOf(validateGeneratedCoupon)
});

export const validateUsersDiscounts = object<ObjectValidator<UsersDiscount>>(
    Object.fromEntries(
        Object.values(PurchasablePlan).filter(v => typeof v === 'number').map(v => [v, optional(validateDiscounts)])
    ) as ObjectValidator<UsersDiscount>
);

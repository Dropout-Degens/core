import { BillingPeriod, PurchasablePlan } from "./definitions"

export const WhopPrices: SubscriptionPriceMap = {
    [PurchasablePlan.AllAccess]: {
        [BillingPeriod.year]: ['plan_dJMpw98NBBnvy', 'plan_GAEa8emHiWSJO'],
        [BillingPeriod.months3]: ['plan_MoNgrgc2tYhWM', 'plan_jcHLswLL8mWU6'],
        [BillingPeriod.months1]: ['plan_81MKG7LrO2MlU', 'plan_L97kXB1BheOJC'],
        [BillingPeriod.weekly]: ['plan_TadvdbFxNT0zm', 'plan_4GJOw4rCOX5pv'],
        other: [
            'plan_OyBfhHoCKnrCi', // 2-month
            'plan_PmCmLoGkyYQGh', // free
        ],
    },

    [PurchasablePlan.Van_HighRoller]: {
        [BillingPeriod.year]: ['plan_rzFf2KqDXIqiZ'],
    },

    ignored: [
        'plan_75go6xsLFQuGx' // General Access (join the server)
    ],
} as const satisfies SubscriptionPriceMap;

export type PricePeriods =  Readonly<Partial<Record<BillingPeriod|'other', string[]>>>;

export type SubscriptionPriceMap = Readonly<Partial<{ ignored?: readonly string[] } & Record<Exclude<PurchasablePlan, PurchasablePlan.Any>, PricePeriods>>>

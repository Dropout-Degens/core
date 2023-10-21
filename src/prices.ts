import { BillingPeriod, PurchasablePlan } from "./definitions.js"

export const StripePrices: SubscriptionPriceMap = {
    [PurchasablePlan.AllAccess]: {
        [BillingPeriod.year]: 'price_1NpHNvKuVSp9UKA3Cx3NRd9q',
        [BillingPeriod.months3]: 'price_1NNNNyKuVSp9UKA34NPsDq00',
        [BillingPeriod.months1]: 'price_1NNNNlKuVSp9UKA3GTbsLUvG',
        [BillingPeriod.weekly]: 'price_1NNNNcKuVSp9UKA3ernITrTU',
        [BillingPeriod.daily]: 'price_1NNNGYKuVSp9UKA31tUEGsP4',
    },

    [PurchasablePlan.PlayerProps]: {
        [BillingPeriod.year]: 'price_1NpHNbKuVSp9UKA3sGbcPXoq',
        [BillingPeriod.months3]: 'price_1NNNCWKuVSp9UKA3yFCaKFrU',
        [BillingPeriod.months1]: 'price_1NNNCJKuVSp9UKA3BuWuVitO',
        [BillingPeriod.weekly]: 'price_1NNNC1KuVSp9UKA3l0PNjEhz',
        [BillingPeriod.daily]: 'price_1NNNBqKuVSp9UKA3aPOVe0ep',
    },

    [PurchasablePlan.Sportsbook]: {
        [BillingPeriod.year]: 'price_1NpHNdKuVSp9UKA3deW9NX2J',
        [BillingPeriod.months3]: 'price_1NMgLgKuVSp9UKA3EYqyKLpF',
        [BillingPeriod.months1]: 'price_1NMgLJKuVSp9UKA39D3K1gvy',
        [BillingPeriod.weekly]: 'price_1NMgKFKuVSp9UKA3zoQEYGQa',
        [BillingPeriod.daily]: 'price_1NMgJSKuVSp9UKA3IQMhROt3',
    }
} as const satisfies SubscriptionPriceMap;

export const WhopPrices = {
    [PurchasablePlan.AllAccess]: {
        [BillingPeriod.year]: 'plan_dJMpw98NBBnvy',
        [BillingPeriod.months3]: 'plan_MoNgrgc2tYhWM',
        [BillingPeriod.months1]: 'plan_81MKG7LrO2MlU',
        [BillingPeriod.weekly]: 'plan_TadvdbFxNT0zm',
        [BillingPeriod.daily]: 'plan_1sVA6zmiExj9c',
        other: [
            'plan_OyBfhHoCKnrCi', // 2-month
            'plan_PmCmLoGkyYQGh', // free
        ],
    },

    [PurchasablePlan.PlayerProps]: {
        [BillingPeriod.year]: 'plan_5RAhvEQuZjC5c',
        [BillingPeriod.months3]: 'plan_Kganoy08fhnON',
        [BillingPeriod.months1]: 'plan_iomn4ewfwxJBm',
        [BillingPeriod.weekly]: 'plan_uoq1dvmD5qFjt',
        [BillingPeriod.daily]: 'plan_7zDVlV1k4wLi1',
        other: [
            'plan_6nGjw734UcUNp' // 2-month
        ],
    },

    [PurchasablePlan.Sportsbook]: {
        [BillingPeriod.year]: 'plan_iQM0pJeN2GBsN',
        [BillingPeriod.months3]: 'plan_0PaF65etyisws',
        [BillingPeriod.months1]: 'plan_FHr1YldSdglYe',
        [BillingPeriod.weekly]: 'plan_4nlObemOPRKHC',
        [BillingPeriod.daily]: 'plan_CYbnKuw9iZtT2',
        other: [
            'plan_vaXwvgNvmBLfG', // 2-month
        ]
    },

    [PurchasablePlan.Van_HighRoller]: {
        [BillingPeriod.year]: 'plan_rzFf2KqDXIqiZ',
    },

    ignored: [
        'plan_75go6xsLFQuGx' // General Access (join the server)
    ],
};

export type PricePeriods =  Readonly<Partial<{ other: readonly string[] } & Record<BillingPeriod, string>>>;

export type SubscriptionPriceMap = Readonly<Partial<{ ignored?: readonly string[] } & Record<Exclude<PurchasablePlan, PurchasablePlan.Any>, PricePeriods>>>

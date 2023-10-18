import { BillingPeriod, PurchasablePlan } from "./definitions.js"

export const StripePrices = {
    AllAccess: {
        year: 'price_1NpHNvKuVSp9UKA3Cx3NRd9q',
        months3: 'price_1NNNNyKuVSp9UKA34NPsDq00',
        months1: 'price_1NNNNlKuVSp9UKA3GTbsLUvG',
        weekly: 'price_1NNNNcKuVSp9UKA3ernITrTU',
        daily: 'price_1NNNGYKuVSp9UKA31tUEGsP4',
    },

    PlayerProps: {
        year: 'price_1NpHNbKuVSp9UKA3sGbcPXoq',
        months3: 'price_1NNNCWKuVSp9UKA3yFCaKFrU',
        months1: 'price_1NNNCJKuVSp9UKA3BuWuVitO',
        weekly: 'price_1NNNC1KuVSp9UKA3l0PNjEhz',
        daily: 'price_1NNNBqKuVSp9UKA3aPOVe0ep',
    },

    Sportsbook: {
        year: 'price_1NpHNdKuVSp9UKA3deW9NX2J',
        months3: 'price_1NMgLgKuVSp9UKA3EYqyKLpF',
        months1: 'price_1NMgLJKuVSp9UKA39D3K1gvy',
        weekly: 'price_1NMgKFKuVSp9UKA3zoQEYGQa',
        daily: 'price_1NMgJSKuVSp9UKA3IQMhROt3',
    }
} as const satisfies SubscriptionPriceMap;

export const WhopPrices = {
    AllAccess: {
        year: 'plan_dJMpw98NBBnvy',
        months3: 'plan_MoNgrgc2tYhWM',
        months1: 'plan_81MKG7LrO2MlU',
        weekly: 'plan_TadvdbFxNT0zm',
        daily: 'plan_1sVA6zmiExj9c',
        other: [
            'plan_OyBfhHoCKnrCi', // 2-month
            'plan_PmCmLoGkyYQGh', // free
        ],
    },

    PlayerProps: {
        year: 'plan_5RAhvEQuZjC5c',
        months3: 'plan_Kganoy08fhnON',
        months1: 'plan_iomn4ewfwxJBm',
        weekly: 'plan_uoq1dvmD5qFjt',
        daily: 'plan_7zDVlV1k4wLi1',
        other: [
            'plan_6nGjw734UcUNp' // 2-month
        ],
    },

    Sportsbook: {
        year: 'plan_iQM0pJeN2GBsN',
        months3: 'plan_0PaF65etyisws',
        months1: 'plan_FHr1YldSdglYe',
        weekly: 'plan_4nlObemOPRKHC',
        daily: 'plan_CYbnKuw9iZtT2',
        other: [
            'plan_vaXwvgNvmBLfG', // 2-month
        ]
    },

    Van_HighRoller: {
        year: 'plan_rzFf2KqDXIqiZ',
    },

    ignored: [
        'plan_75go6xsLFQuGx' // General Access (join the server)
    ],
} as const satisfies SubscriptionPriceMap;

export type PricePeriods =  Readonly<Partial<{ other: readonly string[] } & Record<BillingPeriod, string>>>;

export type SubscriptionPriceMap = Readonly<Partial<{ ignored?: readonly string[] } & Record<Exclude<keyof typeof PurchasablePlan, 'Any'>, PricePeriods>>>

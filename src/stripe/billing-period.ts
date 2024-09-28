import type Stripe from 'stripe';
import { BillingPeriod } from '../definitions';

export type StripeBillingPeriod = Pick<Stripe.Price.Recurring, 'interval' | 'interval_count'>;

export function legacyBillingPeriodToStripeBillingPeriod(billingPeriod: BillingPeriod): StripeBillingPeriod {
    switch (billingPeriod) {
        case BillingPeriod.months1:
            return { interval: 'month', interval_count: 1 };
        case BillingPeriod.months3:
            return { interval: 'month', interval_count: 3 };
        case BillingPeriod.weekly:
            return { interval: 'week', interval_count: 1 };
        case BillingPeriod.year:
            return { interval: 'year', interval_count: 1 };
    }
}

//type StringifiedBillingPeriodType = 'standalone' | 'adverb' | 'adjective'
export enum StringifiedBillingPeriodType {
    /** Just print the duration of the billing period, e.g. "day" or "3 months"
     *
     * Example usage: "We can bill you every day or every 3 months
    */
    DurationShort = 'duration_short',

    /** Print the billing period as an adverb, e.g. "daily" or "3-month"
     *
     * Example usage: "Would you like to be billed monthly or yearly?"
    */
    Adverb = 'adverb',

    /** Print the billing period as an adjective, e.g. "1-day" or "3-month"
     *
     * Example usage: "Would you like a 1-month billing period or a 1-year billing period?"
    */
    Adjective = 'adjective'
}

export function stringifyBillingPeriod(billingPeriod: StripeBillingPeriod, stringType: StringifiedBillingPeriodType = StringifiedBillingPeriodType.DurationShort): string {
    const isPlural = billingPeriod.interval_count !== 1;

    switch (billingPeriod.interval) {
        case 'day':
            switch (stringType) {
                case StringifiedBillingPeriodType.DurationShort:
                    return isPlural ? `${billingPeriod.interval_count} days` : `day`;
                case StringifiedBillingPeriodType.Adverb:
                    return isPlural ? `${billingPeriod.interval_count}-day` : 'daily';
                case StringifiedBillingPeriodType.Adjective:
                    return `${billingPeriod.interval_count}-day`;
            }
        case 'week':
            switch (stringType) {
                case StringifiedBillingPeriodType.DurationShort:
                    return isPlural ? `${billingPeriod.interval_count} weeks` : `week`;
                case StringifiedBillingPeriodType.Adverb:
                    return isPlural ? `${billingPeriod.interval_count}-week` : `weekly`;
                case StringifiedBillingPeriodType.Adjective:
                    return `${billingPeriod.interval_count}-week`;
            }
        case 'month':
            switch (stringType) {
                case StringifiedBillingPeriodType.DurationShort:
                    return isPlural ? `${billingPeriod.interval_count} months` : `month`;
                case StringifiedBillingPeriodType.Adverb:
                    return isPlural ? `${billingPeriod.interval_count}-month` : `monthly`;
                case StringifiedBillingPeriodType.Adjective:
                    return `${billingPeriod.interval_count}-month`;
            }
        case 'year':
            switch (stringType) {
                case StringifiedBillingPeriodType.DurationShort:
                    return isPlural ? `${billingPeriod.interval_count} years` : `year`;
                case StringifiedBillingPeriodType.Adverb:
                    return isPlural ? `${billingPeriod.interval_count}-year` : `yearly`;
                case StringifiedBillingPeriodType.Adjective:
                    return `${billingPeriod.interval_count}-year`;
            }
    }
}

export function getDaysInBillingPeriod(billingPeriod: StripeBillingPeriod): number {
    switch (billingPeriod.interval) {
        case 'day':
            return billingPeriod.interval_count;
        case 'week':
            return billingPeriod.interval_count * 7;
        case 'month':
            return billingPeriod.interval_count * 30;
        case 'year':
            return billingPeriod.interval_count * 365;
    }
}

export function sortBillingPeriods(a: StripeBillingPeriod, b: StripeBillingPeriod) {
    return getDaysInBillingPeriod(a) - getDaysInBillingPeriod(b);
}

export function doBillingPeriodsMatch(a: StripeBillingPeriod, b: StripeBillingPeriod) {
    return a.interval === b.interval && a.interval_count === b.interval_count;
}

export function dedupeAndSortBillingPeriods(billingPeriod: StripeBillingPeriod[]): StripeBillingPeriod[] {
    const set = new Map<string, StripeBillingPeriod>();

    for (const period of billingPeriod) {
        set.set(`${period.interval}:${period.interval_count}`, period);
    }

    return [...set.values()].sort(sortBillingPeriods);
}

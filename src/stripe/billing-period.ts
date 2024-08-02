import type Stripe from 'stripe';

export type StripeBillingPeriod = Pick<Stripe.Price.Recurring, 'interval' | 'interval_count'>;

export function stringifyBillingPeriod(billingPeriod: StripeBillingPeriod , adverb = false): string {
    const isPlural = billingPeriod.interval_count !== 1;

    switch (billingPeriod.interval) {
        case 'day':
            return isPlural ? `${billingPeriod.interval_count} days` : adverb ? 'daily' : 'day';
        case 'week':
            return isPlural ? `${billingPeriod.interval_count} weeks` : adverb ? 'weekly' : 'week';
        case 'month':
            return isPlural ? `${billingPeriod.interval_count} months` : adverb ? 'monthly' : 'month';
        case 'year':
            return isPlural ? `${billingPeriod.interval_count} years` : adverb ? 'yearly' : 'year';
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

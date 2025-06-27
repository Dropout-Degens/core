import type Stripe from "stripe";

export function stripeSubscriptionHasAccess(subscription: Stripe.Subscription): boolean {
    switch (subscription.status) {
        case 'active':
        case 'trialing':
        case 'incomplete':
        case 'past_due':
            return true;

        case 'unpaid':
        case 'incomplete_expired':
        case "canceled":
        case "paused":
            return false;

        default:
            console.warn('Unknown subscription status:', subscription.status satisfies never);
            return false;
    }
}

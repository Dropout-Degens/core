import type Stripe from "stripe";

export function getSubscriptionCycleEndUnixSeconds(sub: Stripe.Subscription): number {
	return (sub.cancel_at ?? (sub.items.data.reduce((acc, item) => Math.max(item.current_period_end, acc), 0) + 60*60*24)) * 1000;
}

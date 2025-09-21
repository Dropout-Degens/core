import type Stripe from "stripe";
import { stripe } from "./instance";
import { stripeSubscriptionHasAccess } from "./has-access";

interface AddSubscriptionTimeInput {
	product: Stripe.Product;
	customer?: Stripe.Customer;
	customerId: string | null;
	subscriptionToUpdate?: Stripe.Subscription;
	userEmail: string | null;
	userId: bigint;
	additionalDays: number;
	disallowNewSubscriber?: boolean;
	disallowExistingSubscriber?: boolean;
	extraCreationMetadata: Record<string, string> | null;
}

type AddSubscriptionTimeInputForExistingSubscriber = AddSubscriptionTimeInput & Required<Pick<AddSubscriptionTimeInput, 'customer' | 'subscriptionToUpdate'>>;

interface AddSubscriptionTimeOutput<TType extends 'created-new' | 'extended-existing' = 'created-new' | 'extended-existing'> {
	type: TType;
	response: Stripe.Response<Stripe.Subscription>;
}

function shouldUpdateExisting(data: AddSubscriptionTimeInput): data is AddSubscriptionTimeInputForExistingSubscriber {
	return data.customer !== undefined && data.subscriptionToUpdate !== undefined;
}

export async function addSubscriptionTime(input: AddSubscriptionTimeInput, couldBeSubscribed: boolean): Promise<AddSubscriptionTimeOutput> {

	if (!input.customer) {
		const existingCustomerResponse =
			input.customerId ? await stripe.customers.retrieve(input.customerId).then(c => ({ data: [c] }))
			: input.userEmail ? await stripe.customers.list({ email: input.userEmail, limit: 1 })
			: await stripe.customers.search({ query: `metadata["discord-id"]:"${input.userId}"`, limit: 1 });

		const existingCustomer = existingCustomerResponse.data[0];
		if (existingCustomer && !existingCustomer.deleted) input.customer = existingCustomer;
	}

	if (couldBeSubscribed && input.customer && !input.subscriptionToUpdate) {
		const subscriptions = await stripe.subscriptions.list({
			customer: input.customer.id,
			current_period_end: {gte: Math.floor(Date.now() / 1000)},
		})

		const activeSubs = subscriptions.data.filter(sub => stripeSubscriptionHasAccess(sub));
		if (activeSubs.length > 0) input.subscriptionToUpdate = activeSubs[0];
	}


	if (shouldUpdateExisting(input)) {
		return await applyAllAccessToExistingSubscriber(input);
	} else {
		return await applyAllAccessToNewSubscriber(input);
	}
}

async function applyAllAccessToNewSubscriber(input: AddSubscriptionTimeInput): Promise<AddSubscriptionTimeOutput<"created-new">> {
	console.log(`Creating new subscription for user ${input.userId} (${input.additionalDays} free days.`, input);
	if (input.disallowNewSubscriber) throw new Error(`Tried to create a new subscription for user ${input.userId}, but new subscribers are not allowed.`);

	input.customer ??= await stripe.customers.create({
		email: input.userEmail ?? undefined,
		metadata: {
			'discord-id': input.userId.toString(),
		},
	});

	const createdSubscription = await stripe.subscriptions.create({
		customer: input.customer.id,
		items: [{
			price_data: {
				currency: 'usd',
				product: input.product.id,
				unit_amount: 0, // free
				recurring: {
					interval: 'day',
					interval_count: input.additionalDays,
				},
			},
		}],
		metadata: {
			'snowflake': input.userId.toString(),
			'discord-id': input.userId.toString(),
			...input.extraCreationMetadata,
		},
	});

	return {
		type: 'created-new',
		response: createdSubscription,
	};
}

async function applyAllAccessToExistingSubscriber(input: AddSubscriptionTimeInputForExistingSubscriber): Promise<AddSubscriptionTimeOutput<"extended-existing">> {
	console.log(`Extending subscription for user ${input.userId} (${input.additionalDays} free days.`, input);
	if (input.disallowExistingSubscriber) throw new Error(`Tried to extend an existing subscription for user ${input.userId}, but existing subscribers are not allowed.`);

	const newTrialEnd = input.subscriptionToUpdate.trial_end ? new Date(input.subscriptionToUpdate.trial_end * 1000) : new Date();
	newTrialEnd.setDate(newTrialEnd.getDate() + input.additionalDays);

	const newTrialEndUnixSeconds = Math.floor(newTrialEnd.getTime() / 1000);

	const updatedSubscription = await stripe.subscriptions.update(input.subscriptionToUpdate.id, {
		trial_end: newTrialEndUnixSeconds,
		proration_behavior: 'none',
	});

	return {
		type: 'extended-existing',
		response: updatedSubscription,
	};
}

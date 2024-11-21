import Stripe from 'stripe';



function generateStripeClientRaw() {
    if (!process.env.STRIPE_SECRET_KEY) throw new Error('No STRIPE_SECRET_KEY env var');

    return new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2024-04-10',
        appInfo: { name: 'Dropout Degens', url: 'https://dropoutdegens.com' },
        typescript: true,
    });
}

function generateStripeClientSafe(): ReturnType<typeof generateStripeClientRaw> {
    if (typeof window === 'undefined') {
        return generateStripeClientRaw();
    }

    return new Proxy({}, {
        get() {
            throw new Error('Cannot connect to Stripe from the client!');
        }
    }) as any;
}


export const stripe = generateStripeClientSafe();

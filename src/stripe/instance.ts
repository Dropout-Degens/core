import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) throw new Error('No STRIPE_SECRET_KEY env var');

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-04-10',
    appInfo: { name: 'Dropout Degens', url: 'https://dropoutdegens.com' },
    typescript: true,
});

export default stripe;

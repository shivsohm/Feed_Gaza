import Stripe from 'stripe';

export async function onRequestPost(context) {
  try {
    const stripe = new Stripe(context.env.STRIPE_SECRET_KEY);
    const { amount, frequency, type } = await context.request.json();
    const amountInCents = Math.round(parseFloat(amount) * 100);

    if (!amountInCents || amountInCents < 100) {
      return new Response(JSON.stringify({ error: 'Minimum donation is $1' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const donationLabel = {
      sadaqah: 'Sadaqah',
      zakat: 'Zakat',
      fidya: 'Fidya / Kaffarah',
      general: 'General Donation'
    }[type] || 'Donation';

    const isMonthly = frequency === 'monthly';
    const origin = new URL(context.request.url).origin;

    const sessionConfig = {
      payment_method_types: ['card'],
      mode: isMonthly ? 'subscription' : 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `FeedGaza — ${donationLabel}`,
            description: isMonthly
              ? 'Monthly donation to feed families in Gaza'
              : 'One-time donation to feed families in Gaza',
          },
          unit_amount: amountInCents,
          ...(isMonthly ? { recurring: { interval: 'month' } } : {}),
        },
        quantity: 1,
      }],
      metadata: { type, frequency },
      success_url: `${origin}/success.html?amount=${amount}&freq=${frequency}&type=${type}`,
      cancel_url: `${origin}/#donate`,
    };

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

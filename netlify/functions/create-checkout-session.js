exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const { amount, frequency, type } = JSON.parse(event.body);
    const amountInCents = Math.round(parseFloat(amount) * 100);

    if (!amountInCents || amountInCents < 100) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Minimum donation is $1' }) };
    }

    const donationLabel = {
      sadaqah: 'Sadaqah',
      zakat: 'Zakat',
      fidya: 'Fidya / Kaffarah',
      general: 'General Donation'
    }[type] || 'Donation';

    const isMonthly = frequency === 'monthly';

    const sessionConfig = {
      payment_method_types: ['card'],
      mode: isMonthly ? 'subscription' : 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `FeedGaza — ${donationLabel}`,
            description: isMonthly
              ? `Monthly donation to feed families in Gaza`
              : `One-time donation to feed families in Gaza`,
          },
          unit_amount: amountInCents,
          ...(isMonthly ? { recurring: { interval: 'month' } } : {}),
        },
        quantity: 1,
      }],
      success_url: `${process.env.URL}/success.html?amount=${amount}&freq=${frequency}&type=${type}`,
      cancel_url: `${process.env.URL}/#donate`,
    };

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error('Stripe error:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const payload = JSON.parse(event.body);

    if (payload.type !== 'checkout.session.completed') {
      return { statusCode: 200, body: 'Ignored' };
    }

    const session = payload.data.object;
    const name = session.customer_details?.name || 'Anonymous';
    const amount = (session.amount_total || 0) / 100;
    const type = session.metadata?.type || 'general';
    const frequency = session.metadata?.frequency || 'once';

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    const { error } = await supabase.from('donations').insert({ name, amount, type, frequency });
    if (error) throw error;

    return { statusCode: 200, body: 'OK' };
  } catch (err) {
    console.error('Webhook error:', err.message);
    return { statusCode: 500, body: err.message };
  }
};

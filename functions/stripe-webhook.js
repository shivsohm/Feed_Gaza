import { createClient } from '@supabase/supabase-js';

export async function onRequestPost(context) {
  try {
    const payload = await context.request.json();

    if (payload.type !== 'checkout.session.completed') {
      return new Response('Ignored', { status: 200 });
    }

    const session = payload.data.object;
    const name = session.customer_details?.name || 'Anonymous';
    const amount = (session.amount_total || 0) / 100;
    const type = session.metadata?.type || 'general';
    const frequency = session.metadata?.frequency || 'once';

    const supabase = createClient(context.env.SUPABASE_URL, context.env.SUPABASE_ANON_KEY);
    const { error } = await supabase.from('donations').insert({ name, amount, type, frequency });
    if (error) throw error;

    return new Response('OK', { status: 200 });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}

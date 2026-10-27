export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { ref, name, phone, pickupDate, pickupTime, items, total, notes } = req.body || {};
  if (![ref, name, phone, pickupDate, pickupTime, items, total].every(v => typeof v === 'string' && v.trim())) {
    return res.status(400).json({ error: 'Please provide all required order details.' });
  }
  const token = process.env.META_ACCESS_TOKEN;
  const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
  const owner = (process.env.OWNER_WHATSAPP || '2348050620968').replace(/\D/g, '');
  const version = process.env.META_GRAPH_API_VERSION || 'v22.0';
  if (!token || !phoneNumberId || !owner) return res.status(503).json({ error: 'Automatic WhatsApp notifications are not configured yet.' });
  const values = [ref, name, phone, pickupDate, pickupTime, items, total, notes || 'None'];
  try {
    const response = await fetch(`https://graph.facebook.com/${version}/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messaging_product: 'whatsapp', to: owner, type: 'template',
        template: { name: process.env.WHATSAPP_ORDER_TEMPLATE || 'new_order_notification', language: { code: process.env.WHATSAPP_TEMPLATE_LANGUAGE || 'en' }, components: [{ type: 'body', parameters: values.map(v => ({ type: 'text', text: String(v ?? 'None').slice(0, 500) })) }] }
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error('WhatsApp order template send failed:', JSON.stringify(data.error || { status: response.status }));
      return res.status(502).json({ error: 'WhatsApp could not send the alert. Check the template and Meta settings.' });
    }
    return res.status(200).json({ ok: true, messageId: data.messages?.[0]?.id || null });
  } catch (error) {
    console.error('WhatsApp order notification request failed.');
    return res.status(502).json({ error: 'Could not contact WhatsApp to send the alert.' });
  }
}

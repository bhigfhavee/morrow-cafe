export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    ref, name, phone, pickupDate,
    pickupTime, items, total, notes
  } = req.body || {};

  const token = process.env.META_ACCESS_TOKEN;
  const phoneId = process.env.META_PHONE_NUMBER_ID;
  const owner = process.env.OWNER_WHATSAPP || "2348050620968";

  if (!token || !phoneId) {
    return res.status(503).json({
      error: "WhatsApp notifications are not configured yet."
    });
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v22.0/${phoneId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: owner,
          type: "template",
          template: {
            name: process.env.WHATSAPP_ORDER_TEMPLATE || "new_order_notification",
            language: { code: "en" },
            components: [{
              type: "body",
              parameters: [
                ref, name, phone, pickupDate,
                pickupTime, items, total, notes || "None"
              ].map(value => ({
                type: "text",
                text: String(value || "None")
              }))
            }]
          }
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return res.status(502).json({
        error: "WhatsApp notification failed."
      });
    }

    return res.status(200).json({
      success: true,
      messageId: result.messages?.[0]?.id
    });

  } catch (error) {
    return res.status(500).json({
      error: "Notification service error."
    });
  }
  }

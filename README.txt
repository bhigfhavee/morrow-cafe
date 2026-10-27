MORROW CAFE - VERCEL NOTIFICATION STARTER

This bundle contains the static website plus Vercel serverless endpoints for order and booking WhatsApp template notifications.

IMPORTANT: Notifications will NOT work until you have configured a Meta WhatsApp Business Platform Cloud API access token, phone number ID, and approved message templates that exactly match the names and number of body placeholders configured here.

Required Vercel environment variables:
OWNER_WHATSAPP=2348050620968
META_ACCESS_TOKEN= (secret from Meta)
META_PHONE_NUMBER_ID= (Meta WhatsApp phone number ID)
META_GRAPH_API_VERSION=v22.0 (or a currently supported version)
WHATSAPP_BOOKING_TEMPLATE=new_booking_notification
WHATSAPP_ORDER_TEMPLATE=new_order_notification
WHATSAPP_TEMPLATE_LANGUAGE=en

Booking template body must have 7 placeholders, in this order: reference, name, customer phone, guests, date, time, notes.
Order template body must have 8 placeholders, in this order: reference, name, customer phone, collection date, collection time, item list, estimated total, notes.

Deploy the entire folder/repository to Vercel (not only index.html), then add the environment variables in Project Settings > Environment Variables and redeploy. Keep META_ACCESS_TOKEN secret. Do not treat an order or booking as confirmed until the café replies.

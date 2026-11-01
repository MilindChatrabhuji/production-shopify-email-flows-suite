/**
 * Cloudflare Workers Edge Webhook Listener & Payload Normalizer
 * Normalizes payloads across Shopify, Klaviyo, Omnisend, and Mailchimp.
 */

export interface NormalizedEdgeEvent {
  sourcePlatform: 'SHOPIFY' | 'KLAVIYO' | 'OMNISEND' | 'MAILCHIMP';
  eventType: 'CART_ABANDONED' | 'ORDER_PLACED' | 'CUSTOMER_SUBSCRIBED' | 'EMAIL_OPENED' | 'EMAIL_CLICKED';
  timestamp: string;
  email: string;
  monetaryValueUSD: number;
  metadata: Record<string, any>;
}

export class KlaviyoShopifyWebhookHandler {
  public normalizeShopifyWebhook(headers: Headers, rawBody: any): NormalizedEdgeEvent {
    const topic = headers.get('X-Shopify-Topic') || 'checkouts/update';
    let eventType: NormalizedEdgeEvent['eventType'] = 'CART_ABANDONED';

    if (topic.includes('order')) {
      eventType = 'ORDER_PLACED';
    } else if (topic.includes('customer')) {
      eventType = 'CUSTOMER_SUBSCRIBED';
    }

    const email = rawBody?.email || rawBody?.customer?.email || 'unknown@example.com';
    const monetaryValueUSD = parseFloat(rawBody?.total_price || rawBody?.subtotal_price || '0');

    return {
      sourcePlatform: 'SHOPIFY',
      eventType,
      timestamp: new Date().toISOString(),
      email,
      monetaryValueUSD,
      metadata: {
        rawId: rawBody?.id || rawBody?.token,
        cartToken: rawBody?.cart_token
      }
    };
  }

  public normalizeKlaviyoWebhook(rawBody: any): NormalizedEdgeEvent {
    return {
      sourcePlatform: 'KLAVIYO',
      eventType: rawBody?.type === 'open' ? 'EMAIL_OPENED' : 'EMAIL_CLICKED',
      timestamp: new Date().toISOString(),
      email: rawBody?.email || 'subscriber@example.com',
      monetaryValueUSD: 0,
      metadata: { flowId: rawBody?.flow_id, messageId: rawBody?.message_id }
    };
  }
}

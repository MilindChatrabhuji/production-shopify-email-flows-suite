/**
 * Production Shopify Event Trigger Router & Flow Dispatcher
 * Matches Shopify and Klaviyo webhooks to specific automated lifecycle flows.
 */

export type ShopifyWebhookTopic = 
  | 'orders/create'
  | 'checkouts/create'
  | 'checkouts/update'
  | 'customers/create'
  | 'customers/update'
  | 'fulfillments/create';

export interface WebhookEventPayload {
  topic: ShopifyWebhookTopic;
  eventId: string;
  storeDomain: string;
  customer: {
    id: string;
    email: string;
    firstName: string;
    totalOrders: number;
    totalSpentUSD: number;
  };
  cart?: {
    checkoutToken: string;
    itemsCount: number;
    subtotalUSD: number;
    cartUrl: string;
    abandonedAt?: string;
  };
  order?: {
    orderNumber: string;
    totalUSD: number;
    items: { title: string; price: number; quantity: number }[];
  };
}

export interface FlowDispatchDecision {
  flowId: string;
  flowName: string;
  action: 'TRIGGER_IMMEDIATE' | 'SCHEDULE_DELAY' | 'SUPPRESS';
  delayMinutes: number;
  templateKey: string;
  metadata: Record<string, any>;
}

export class FlowTriggerRouter {
  public routeEvent(payload: WebhookEventPayload): FlowDispatchDecision {
    switch (payload.topic) {
      case 'checkouts/update':
      case 'checkouts/create':
        if (payload.cart && payload.cart.itemsCount > 0) {
          return {
            flowId: 'flow-abandoned-cart-01',
            flowName: '3-Stage Dynamic Cart Recovery Sequence',
            action: 'SCHEDULE_DELAY',
            delayMinutes: 60, // Stage 1 fires at 1 hour
            templateKey: 'tpl_cart_stage_1',
            metadata: { cartUrl: payload.cart.cartUrl, value: payload.cart.subtotalUSD }
          };
        }
        break;

      case 'customers/create':
        return {
          flowId: 'flow-welcome-nurture-01',
          flowName: 'High-Converting Brand Welcome Series',
          action: 'TRIGGER_IMMEDIATE',
          delayMinutes: 0,
          templateKey: 'tpl_welcome_intro',
          metadata: { isNewSubscriber: true }
        };

      case 'orders/create':
        if (payload.customer.totalOrders <= 1) {
          return {
            flowId: 'flow-first-purchase-01',
            flowName: 'First-Time Customer Post-Purchase Onboarding',
            action: 'SCHEDULE_DELAY',
            delayMinutes: 120, // 2 hours post purchase
            templateKey: 'tpl_unboxing_guide',
            metadata: { orderNumber: payload.order?.orderNumber }
          };
        } else {
          return {
            flowId: 'flow-repeat-vip-01',
            flowName: 'VIP Repeat Customer Replenishment & Cross-Sell',
            action: 'SCHEDULE_DELAY',
            delayMinutes: 1440, // 24 hours
            templateKey: 'tpl_vip_gratitude',
            metadata: { totalOrders: payload.customer.totalOrders }
          };
        }

      default:
        break;
    }

    return {
      flowId: 'none',
      flowName: 'Suppressed / No Action',
      action: 'SUPPRESS',
      delayMinutes: 0,
      templateKey: 'none',
      metadata: {}
    };
  }
}

/**
 * Pack 2 Test & Demonstration Runner
 */
import { KlaviyoShopifyWebhookHandler } from './klaviyo_shopify_webhook';
import { EmailAnalyticsAggregator } from './email_analytics_aggregator';
import { DeliverabilityGuard } from './deliverability_guard';

console.log("=== Testing Pack 2: Edge Email Gateway ===");

const handler = new KlaviyoShopifyWebhookHandler();
const normalized = handler.normalizeShopifyWebhook(new Headers({ 'X-Shopify-Topic': 'checkouts/update' }), {
  id: "chk-999",
  email: "customer@example.com",
  total_price: "129.50"
});
console.log("Normalized Webhook:", normalized.eventType, "Value:", normalized.monetaryValueUSD);

const aggregator = new EmailAnalyticsAggregator();
const report = aggregator.compute({
  flowName: "Abandoned Cart Flow",
  totalRecipients: 1000,
  opens: 520,
  clicks: 180,
  ordersPlaced: 35,
  totalRevenueUSD: 4200
});
console.log("Report Open Rate:", report.openRatePercent + "%", "RPR: $" + report.revenuePerRecipientUSD, "Status:", report.healthStatus);

const guard = new DeliverabilityGuard();
const audit = guard.auditDomain("shop.example.com", "Discover our latest clinical wellness updates.");
console.log("Domain Auth Valid:", audit.isFullyAuthenticated, "Spam Score:", audit.spamTriggerScore);

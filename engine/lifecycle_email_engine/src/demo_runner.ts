/**
 * Pack 1 Test & Demonstration Runner
 */
import { FlowTriggerRouter } from './flow_trigger_router';
import { CartAbandonmentSynthesizer } from './cart_abandonment_synthesizer';
import { WinbackSegmenter } from './winback_segmenter';
import { PostPurchaseNurtureBuilder } from './post_purchase_nurture_builder';
import { CustomerLifetimeValueScorer } from './customer_lifetime_value_scorer';

console.log("=== Testing Pack 1: Lifecycle Email Engine ===");

// 1. Router
const router = new FlowTriggerRouter();
const decision = router.routeEvent({
  topic: 'checkouts/update',
  eventId: 'evt-101',
  storeDomain: 'shop.example.com',
  customer: { id: 'c-1', email: 'test@example.com', firstName: 'John', totalOrders: 1, totalSpentUSD: 85 },
  cart: { checkoutToken: 'tok_abc123', itemsCount: 2, subtotalUSD: 140, cartUrl: 'https://shop.example.com/checkout/tok_abc123' }
});
console.log("Router Action:", decision.action, "Flow:", decision.flowName);

// 2. Cart Synthesizer
const cartSynth = new CartAbandonmentSynthesizer();
const stages = cartSynth.generateThreeStageFlow({
  customerFirstName: 'Sarah',
  cartItemsSummary: 'Clinical Diagnostic Monitor (2-Pack)',
  cartTotalUSD: 140,
  cartCheckoutUrl: 'https://shop.example.com/checkout/tok_abc123',
  brandName: 'NexusHealth'
});
console.log("Cart Recovery Stages Generated:", stages.length);
console.log("Stage 3 Incentive:", stages[2].incentiveCode);

// 3. Winback
const winback = new WinbackSegmenter();
const cohort = winback.classifyCohort({ customerId: 'c-2', email: 'c2@example.com', daysSinceLastPurchase: 95, totalOrdersCount: 2, lifetimeSpendUSD: 210 });
const strat = winback.getStrategy(cohort, 'David');
console.log("Winback Cohort:", cohort, "Subject:", strat.recommendedSubject);

// 4. Post-Purchase
const nurture = new PostPurchaseNurtureBuilder();
const postSeq = nurture.buildSequence({ orderNumber: '1042', customerName: 'David', purchasedProduct: 'Diagnostic Monitor', expectedDeliveryDays: 3, replenishmentCycleDays: 60 });
console.log("Post-Purchase Steps:", postSeq.length);

// 5. CLV Scorer
const clv = new CustomerLifetimeValueScorer();
const clvResult = clv.calculate({ totalRevenueUSD: 850, orderCount: 3, averageOrderValueUSD: 283, accountAgeDays: 180, lastOrderDaysAgo: 25 });
console.log("CLV Tier:", clvResult.tier, "Predicted 12m Spend:", clvResult.predictedFuture12mSpendUSD);

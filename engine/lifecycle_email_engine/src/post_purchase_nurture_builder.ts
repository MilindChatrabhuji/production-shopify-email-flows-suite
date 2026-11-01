/**
 * Post-Purchase Nurture & Replenishment Flow Synthesizer
 * Maximizes AOV, reduces returns, and triggers timely replenishment workflows.
 */

export interface PostPurchaseFlowConfig {
  orderNumber: string;
  customerName: string;
  purchasedProduct: string;
  expectedDeliveryDays: number;
  replenishmentCycleDays: number;
}

export interface PostPurchaseSequence {
  sequenceType: 'UNBOXING_GUIDE' | 'CHECKIN_SATISFACTION' | 'CROSS_SELL_COMPLEMENT' | 'REPLENISHMENT_REMINDER';
  triggerTiming: string;
  subjectLine: string;
  coreObjective: string;
}

export class PostPurchaseNurtureBuilder {
  public buildSequence(cfg: PostPurchaseFlowConfig): PostPurchaseSequence[] {
    return [
      {
        sequenceType: 'UNBOXING_GUIDE',
        triggerTiming: `Day 1 after delivery (approx Day ${cfg.expectedDeliveryDays + 1})`,
        subjectLine: `How to get the most out of your new ${cfg.purchasedProduct}`,
        coreObjective: 'Set up instructions, best practices, reducing customer support tickets and returns.'
      },
      {
        sequenceType: 'CHECKIN_SATISFACTION',
        triggerTiming: `Day 7 after delivery (approx Day ${cfg.expectedDeliveryDays + 7})`,
        subjectLine: `How is your ${cfg.purchasedProduct} performing?`,
        coreObjective: 'Collect honest product reviews and identify any dissatisfied customers early.'
      },
      {
        sequenceType: 'CROSS_SELL_COMPLEMENT',
        triggerTiming: `Day 14 after delivery`,
        subjectLine: `Pair your ${cfg.purchasedProduct} with these curated essentials`,
        coreObjective: 'Increase second-purchase conversion with complementary accessory recommendations.'
      },
      {
        sequenceType: 'REPLENISHMENT_REMINDER',
        triggerTiming: `Day ${cfg.replenishmentCycleDays - 7} (7 days before expected depletion)`,
        subjectLine: `Running low on ${cfg.purchasedProduct}? Restock with 1-click`,
        coreObjective: 'Predictive consumable reorder trigger with frictionless one-click re-order link.'
      }
    ];
  }
}

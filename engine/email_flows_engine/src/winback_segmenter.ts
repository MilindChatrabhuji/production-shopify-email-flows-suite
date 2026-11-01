/**
 * RFM (Recency, Frequency, Monetary) Cohort Segmenter & Win-Back Engine
 * Classifies customers by purchase intervals (60, 90, 120 days) and calculates re-engagement triggers.
 */

export interface CustomerPurchaseHistory {
  customerId: string;
  email: string;
  daysSinceLastPurchase: number;
  totalOrdersCount: number;
  lifetimeSpendUSD: number;
}

export type RFMCohort = 'ACTIVE_LOYAL' | 'LAPSED_60_DAYS' | 'LAPSED_90_DAYS' | 'DORMANT_120_DAYS' | 'CHURNED';

export interface WinBackStrategy {
  cohort: RFMCohort;
  recommendedSubject: string;
  incentiveTier: string;
  recommendedAngle: string;
  urgencyLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export class WinbackSegmenter {
  public classifyCohort(history: CustomerPurchaseHistory): RFMCohort {
    if (history.daysSinceLastPurchase <= 45) return 'ACTIVE_LOYAL';
    if (history.daysSinceLastPurchase <= 75) return 'LAPSED_60_DAYS';
    if (history.daysSinceLastPurchase <= 105) return 'LAPSED_90_DAYS';
    if (history.daysSinceLastPurchase <= 150) return 'DORMANT_120_DAYS';
    return 'CHURNED';
  }

  public getStrategy(cohort: RFMCohort, firstName: string = 'Friend'): WinBackStrategy {
    switch (cohort) {
      case 'LAPSED_60_DAYS':
        return {
          cohort,
          recommendedSubject: `${firstName}, we noticed it's been a while (new updates inside)`,
          incentiveTier: 'Free Shipping Code or 5% VIP Discount',
          recommendedAngle: 'Product updates, new related catalog additions, gentle check-in.',
          urgencyLevel: 'LOW'
        };
      case 'LAPSED_90_DAYS':
        return {
          cohort,
          recommendedSubject: `${firstName}, we miss you — here is $15 towards your next order`,
          incentiveTier: '$15 Off Orders Over $75',
          recommendedAngle: 'Direct financial voucher, highlighting customer satisfaction guarantee.',
          urgencyLevel: 'MEDIUM'
        };
      case 'DORMANT_120_DAYS':
        return {
          cohort,
          recommendedSubject: `Should we say goodbye, ${firstName}? (Final account update)`,
          incentiveTier: '20% Deep Winback Code (COMEBACK20)',
          recommendedAngle: 'Opt-out notice, emotional loss-aversion, peak incentive threshold.',
          urgencyLevel: 'HIGH'
        };
      case 'CHURNED':
        return {
          cohort,
          recommendedSubject: `We are cleaning up our list — keep receiving updates?`,
          incentiveTier: 'None (Deliverability hygiene purge)',
          recommendedAngle: 'Explicit permission reconfirmation before automated suppression.',
          urgencyLevel: 'CRITICAL'
        };
      default:
        return {
          cohort: 'ACTIVE_LOYAL',
          recommendedSubject: `VIP Early Access for our top community members`,
          incentiveTier: 'VIP Exclusive Perks',
          recommendedAngle: 'Gratitude, early access, exclusive product beta testing.',
          urgencyLevel: 'LOW'
        };
    }
  }
}

/**
 * Customer Lifetime Value (CLV) Predictive Scorer
 * Classifies customers into tiers: Platinum, Gold, Silver, Bronze, and At-Risk.
 */

export interface CustomerMetrics {
  totalRevenueUSD: number;
  orderCount: number;
  averageOrderValueUSD: number;
  accountAgeDays: number;
  lastOrderDaysAgo: number;
}

export interface CLVScoreResult {
  score: number; // 0 to 100
  tier: 'PLATINUM' | 'GOLD' | 'SILVER' | 'BRONZE' | 'AT_RISK';
  predictedFuture12mSpendUSD: number;
  recommendedAction: string;
}

export class CustomerLifetimeValueScorer {
  public calculate(metrics: CustomerMetrics): CLVScoreResult {
    let score = 50;

    // Monetary score
    if (metrics.totalRevenueUSD > 1000) score += 25;
    else if (metrics.totalRevenueUSD > 400) score += 15;
    else if (metrics.totalRevenueUSD > 150) score += 5;

    // Frequency score
    if (metrics.orderCount >= 4) score += 15;
    else if (metrics.orderCount >= 2) score += 8;

    // Recency penalty
    if (metrics.lastOrderDaysAgo > 120) score -= 20;
    else if (metrics.lastOrderDaysAgo > 60) score -= 10;
    else score += 10;

    score = Math.max(0, Math.min(100, score));

    let tier: 'PLATINUM' | 'GOLD' | 'SILVER' | 'BRONZE' | 'AT_RISK' = 'SILVER';
    let predictedFuture = metrics.averageOrderValueUSD * 2;

    if (score >= 85) {
      tier = 'PLATINUM';
      predictedFuture = metrics.averageOrderValueUSD * 4.5;
    } else if (score >= 70) {
      tier = 'GOLD';
      predictedFuture = metrics.averageOrderValueUSD * 3.0;
    } else if (score < 40 && metrics.lastOrderDaysAgo > 90) {
      tier = 'AT_RISK';
      predictedFuture = metrics.averageOrderValueUSD * 0.4;
    } else if (score < 50) {
      tier = 'BRONZE';
      predictedFuture = metrics.averageOrderValueUSD * 1.0;
    }

    return {
      score,
      tier,
      predictedFuture12mSpendUSD: Math.round(predictedFuture),
      recommendedAction: tier === 'PLATINUM' 
        ? 'Enroll in private concierge VIP list with handwritten note and exclusive previews.'
        : tier === 'AT_RISK'
        ? 'Route through high-urgency winback sequence with generous re-activation incentive.'
        : 'Standard automated nurture and cross-sell flow.'
    };
  }
}

/**
 * Real-Time Edge Analytics Aggregator
 * Computes Open Rates, CTR, Placed Order Rates (POR), and Revenue Per Recipient (RPR).
 */

export interface FlowPerformanceMetrics {
  flowName: string;
  totalRecipients: number;
  opens: number;
  clicks: number;
  ordersPlaced: number;
  totalRevenueUSD: number;
}

export interface ComputedAnalyticsReport {
  flowName: string;
  openRatePercent: number; // Benchmark: 40-60%
  clickThroughRatePercent: number; // Benchmark: 2-5%
  placedOrderRatePercent: number; // Benchmark: 1.5-3.5%
  revenuePerRecipientUSD: number; // Benchmark: $1.50 - $4.00
  healthStatus: 'OPTIMAL' | 'AVERAGE' | 'ATTENTION_NEEDED';
}

export class EmailAnalyticsAggregator {
  public compute(metrics: FlowPerformanceMetrics): ComputedAnalyticsReport {
    const openRate = metrics.totalRecipients > 0 ? (metrics.opens / metrics.totalRecipients) * 100 : 0;
    const ctr = metrics.opens > 0 ? (metrics.clicks / metrics.opens) * 100 : 0;
    const por = metrics.totalRecipients > 0 ? (metrics.ordersPlaced / metrics.totalRecipients) * 100 : 0;
    const rpr = metrics.totalRecipients > 0 ? metrics.totalRevenueUSD / metrics.totalRecipients : 0;

    let healthStatus: ComputedAnalyticsReport['healthStatus'] = 'OPTIMAL';
    if (openRate < 30 || rpr < 1.0) {
      healthStatus = 'ATTENTION_NEEDED';
    } else if (openRate < 42 || rpr < 2.0) {
      healthStatus = 'AVERAGE';
    }

    return {
      flowName: metrics.flowName,
      openRatePercent: parseFloat(openRate.toFixed(2)),
      clickThroughRatePercent: parseFloat(ctr.toFixed(2)),
      placedOrderRatePercent: parseFloat(por.toFixed(2)),
      revenuePerRecipientUSD: parseFloat(rpr.toFixed(2)),
      healthStatus
    };
  }
}

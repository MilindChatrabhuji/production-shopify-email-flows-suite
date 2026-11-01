/**
 * Dynamic 3-Stage Cart Recovery Sequence Generator
 * Generates tailored copy, timing, and incentives across 1h, 24h, and 48h milestones.
 */

export interface CartContext {
  customerFirstName: string;
  cartItemsSummary: string;
  cartTotalUSD: number;
  cartCheckoutUrl: string;
  brandName: string;
}

export interface CartRecoveryStage {
  stageNumber: number;
  delayHours: number;
  subjectLine: string;
  previewText: string;
  angle: 'HELP_AND_INVENTORY_HOLD' | 'SOCIAL_PROOF_AND_REVIEWS' | 'TIERED_INCENTIVE_DEADLINE';
  headline: string;
  bodyCopy: string;
  ctaText: string;
  incentiveCode?: string;
}

export class CartAbandonmentSynthesizer {
  public generateThreeStageFlow(ctx: CartContext): CartRecoveryStage[] {
    const name = ctx.customerFirstName || 'there';

    return [
      {
        stageNumber: 1,
        delayHours: 1,
        angle: 'HELP_AND_INVENTORY_HOLD',
        subjectLine: `${name}, did something interrupt your order?`,
        previewText: `We saved your ${ctx.cartItemsSummary} for the next few hours.`,
        headline: 'We Saved Your Cart For You',
        bodyCopy: `Hey ${name},\n\nWe noticed you left your selected items in your cart. Life gets busy, so we temporarily reserved your ${ctx.cartItemsSummary} to ensure it does not sell out.\n\nIf you had any technical questions or need assistance completing your order, our dedicated team is here to help.`,
        ctaText: 'Complete Your Order Now &rarr;'
      },
      {
        stageNumber: 2,
        delayHours: 24,
        angle: 'SOCIAL_PROOF_AND_REVIEWS',
        subjectLine: `See why 10,000+ customers trust ${ctx.brandName}`,
        previewText: 'Real verified reviews from daily professionals.',
        headline: 'Engineered for Performance & Proven by Real Results',
        bodyCopy: `Hey ${name},\n\nWhen you invest in ${ctx.brandName}, you are backed by evidence-based design and precision engineering.\n\nHere is what our verified customers say:\n"The build quality and precision exceeded my expectations. Outstanding support and seamless experience." — Dr. Sarah M., Verified Buyer\n\nYour cart is still waiting, but inventory is moving rapidly.`,
        ctaText: 'Claim Your Reserved Items &rarr;'
      },
      {
        stageNumber: 3,
        delayHours: 48,
        angle: 'TIERED_INCENTIVE_DEADLINE',
        subjectLine: `Final Notice: Special 10% courtesy savings for ${name}`,
        previewText: 'Your cart reservation and exclusive savings code expire tonight.',
        headline: 'An Exclusive Courtesy Savings Just for You',
        bodyCopy: `Hey ${name},\n\nWe want to welcome you to the ${ctx.brandName} community. As a one-time courtesy, use code RECOVER10 at checkout to unlock 10% off your entire order of ${ctx.cartItemsSummary}.\n\nNotice: This private code and your cart reservation expire strictly in 12 hours.`,
        ctaText: 'Activate 10% Savings & Checkout &rarr;',
        incentiveCode: 'RECOVER10'
      }
    ];
  }
}

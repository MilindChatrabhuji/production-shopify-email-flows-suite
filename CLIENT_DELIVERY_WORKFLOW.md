# Client Delivery Workflow: E-Commerce Email Lifecycle Optimization

## Standard Operating Procedure (SOP)

### Stage 1: Store Intake & Access Protocol
1. Distribute `CLIENT_STORE_ONBOARDING_BRIEF.md` to brand owner or marketing lead.
2. Request delegated limited-access API keys for Klaviyo or Shopify Partner account.
3. Review and sign `EMAIL_MARKETING_SERVICE_AGREEMENT.md`.

### Stage 2: DNS & Deliverability Audit
1. Run `deliverability_guard.ts` against client sending domain.
2. Verify active SPF, DKIM, DMARC (p=quarantine or p=reject), and BIMI records.
3. Scan existing templates for spam triggers and non-compliant unsubscribe links.

### Stage 3: Core Lifecycle Flow Construction
1. Deploy 3-stage Cart Abandonment sequence via `cart_abandonment_synthesizer.ts`.
2. Configure high-converting Welcome Series with brand storytelling.
3. Deploy Post-Purchase unboxing, cross-sell, and review request sequences via `post_purchase_nurture_builder.ts`.

### Stage 4: RFM Cohort Segmentation & Win-Back Activation
1. Ingest customer historical purchase CSV into `winback_segmenter.ts`.
2. Segment lapsed customers into 60-day, 90-day, and 120-day cohorts.
3. Apply predictive lifetime value scoring via `customer_lifetime_value_scorer.ts`.

### Stage 5: Edge Webhook Integration & Testing
1. Configure Shopify store webhooks pointing to Cloudflare Workers edge router (`worker.ts`).
2. Test end-to-end checkout abandonment triggers and flow firing latencies (sub-50ms).

### Stage 6: Reporting & Retainer Billing
1. Monitor weekly Revenue Per Recipient (RPR) and Placed Order Rates via `email_analytics_aggregator.ts`.
2. Issue monthly retainer invoice via `invoicing_engine.ts` with GST LUT zero-rated export exemption.

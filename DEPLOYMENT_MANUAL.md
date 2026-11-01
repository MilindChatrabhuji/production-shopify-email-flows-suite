# Deployment & Operations Manual: Way #58 (Product 60)

## 1. Quick Start & Prerequisites
- Node.js v18.0.0+ LTS or v20.0.0+ LTS
- npm v9.0.0+
- Wrangler CLI v3.0.0+ (`npm install -g wrangler`)
- Modern Web Browser (Chrome, Firefox, Safari, Edge)

---

## 2. Local Installation & Development

### Pack 1: Core Lifecycle Email Engine
```bash
cd engine/lifecycle_email_engine
npm install
npm run build
npm test
```

### Pack 2: Edge Email Gateway & Deliverability Monitor
```bash
cd engine/edge_email_gateway
npm install
npm run build

# Run local edge simulator
npx wrangler dev
```

### Pack 3: Monetization Kit
```bash
cd monetization_email_kit
npm install
npm run build
```

---

## 3. Cloudflare D1 Database Provisioning
To initialize the D1 database for production edge deployment:
```bash
# 1. Create the D1 database instance
npx wrangler d1 create shopify-email-flows-db

# 2. Apply database migrations
npx wrangler d1 execute shopify-email-flows-db --file=src/schema.sql

# 3. Deploy the Edge Gateway Worker
npx wrangler deploy
```

---

## 4. Interactive Showcase Launch
Open `showcase/index.html` directly in any web browser:
```bash
npx serve showcase
```
Exposes 4 interactive screens:
1. Flow Architect & Webhook Trigger Router
2. 3-Stage Abandoned Cart Copy & Incentive Synthesizer
3. RFM Cohort Segmentation & Win-Back Dashboard
4. Edge Deliverability & DNS Guard (SPF/DKIM/DMARC/BIMI)

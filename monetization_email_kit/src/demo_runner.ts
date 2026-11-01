/**
 * Pack 3 Test & Demonstration Runner
 */
import { InvoicingEngine } from './invoicing_engine';

console.log("=== Testing Pack 3: Email Monetization Kit ===");

const engine = new InvoicingEngine();
const invoice = engine.generateInvoice("2026-WAY58", {
  name: "PureLife Brands Inc",
  email: "billing@shop.example.com",
  country: "United States",
  isExport: true
}, [
  {
    description: "Growth Lifecycle Retainer (6 Core Automated Flows + RFM Segmentation)",
    tier: "GROWTH_LIFECYCLE",
    amount: 1500,
    currency: "USD"
  }
], "USD");

console.log("Invoice #:", invoice.invoiceNumber, "Total:", invoice.totalAmount, invoice.currency);

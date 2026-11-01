/**
 * Dual-Currency Invoicing Engine (USD & INR) for E-Commerce Email Retainers
 * Supports: Monthly Retainers ($500 / $1,500 / $3,000) and GST LUT export exemptions.
 */

export interface EmailRetainerItem {
  description: string;
  tier: 'STARTER_AUDIT' | 'GROWTH_LIFECYCLE' | 'SCALE_BRAND';
  amount: number;
  currency: 'USD' | 'INR';
}

export interface ClientProfile {
  name: string;
  email: string;
  country: string;
  isExport: boolean;
  gstin?: string;
}

export interface GeneratedEmailInvoice {
  invoiceNumber: string;
  date: string;
  client: ClientProfile;
  items: EmailRetainerItem[];
  subtotal: number;
  gstAmount: number;
  totalAmount: number;
  currency: 'USD' | 'INR';
  paymentDetails: {
    domesticUpi: string;
    internationalPaypal: string;
  };
  notes: string;
}

export class InvoicingEngine {
  private domesticUpi = 'milind.chatrabhuji@okhdfcbank';
  private internationalPaypal = 'milind.chatrabhuji@gmail.com';

  public generateInvoice(
    invoiceId: string,
    client: ClientProfile,
    items: EmailRetainerItem[],
    currency: 'USD' | 'INR' = 'USD'
  ): GeneratedEmailInvoice {
    let subtotal = 0;
    items.forEach(i => subtotal += i.amount);

    // GST Rule: Foreign export under LUT is 0% IGST. Domestic Indian brand is 18% GST.
    const gstRate = client.isExport ? 0.00 : 0.18;
    const gstAmount = subtotal * gstRate;
    const totalAmount = subtotal + gstAmount;

    return {
      invoiceNumber: `INV-EML-${invoiceId}`,
      date: new Date().toISOString().split('T')[0],
      client,
      items,
      subtotal,
      gstAmount,
      totalAmount,
      currency,
      paymentDetails: {
        domesticUpi: this.domesticUpi,
        internationalPaypal: this.internationalPaypal
      },
      notes: client.isExport
        ? 'Export of Professional Services under Letter of Undertaking (LUT) without payment of IGST under Rule 96A of CGST Rules 2017.'
        : 'Domestic E-Commerce Consulting & Email Automation Services. Standard 18% GST applied.'
    };
  }
}

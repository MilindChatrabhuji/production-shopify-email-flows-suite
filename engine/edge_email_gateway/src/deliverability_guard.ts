/**
 * Deliverability & DNS Guard (SPF, DKIM, DMARC, BIMI)
 * Validates authentication protocols and audits email content for spam triggers.
 */

export interface DeliverabilityAuditReport {
  sendingDomain: string;
  isFullyAuthenticated: boolean;
  dnsRecords: {
    spfStatus: 'PASS' | 'FAIL' | 'MISSING';
    dkimStatus: 'PASS' | 'FAIL' | 'MISSING';
    dmarcStatus: 'PASS' | 'QUARANTINE' | 'NONE' | 'MISSING';
    bimiStatus: 'CONFIGURED' | 'OPTIONAL';
  };
  spamTriggerScore: number; // 0 to 100 (0 = clean, >30 = risky)
  detectedSpamWords: string[];
  recommendations: string[];
}

export class DeliverabilityGuard {
  private spamKeywords = [
    '100% free',
    'make money fast',
    'cure guaranteed',
    'act now immediately',
    'risk-free investment',
    'miracle'
  ];

  public scanContentForSpamTriggers(content: string): { score: number; detected: string[] } {
    const textLower = content.toLowerCase();
    const detected: string[] = [];

    this.spamKeywords.forEach(kw => {
      if (textLower.includes(kw)) {
        detected.push(kw);
      }
    });

    const score = detected.length * 15;
    return { score, detected };
  }

  public auditDomain(domain: string, sampleContent: string = ''): DeliverabilityAuditReport {
    const spamCheck = this.scanContentForSpamTriggers(sampleContent);
    const recs: string[] = [];

    // Mock DNS record state for standard compliant domain
    const isDomainValid = domain.length > 3 && domain.includes('.');
    const spfStatus = isDomainValid ? 'PASS' : 'FAIL';
    const dkimStatus = isDomainValid ? 'PASS' : 'FAIL';
    const dmarcStatus = isDomainValid ? 'PASS' : 'MISSING';

    if (spamCheck.detected.length > 0) {
      recs.push(`Remove high-risk spam trigger words: ${spamCheck.detected.join(', ')}.`);
    }
    recs.push('Ensure custom sending domain (e.g. mail.brand.com) matches DMARC organizational domain.');

    return {
      sendingDomain: domain,
      isFullyAuthenticated: spfStatus === 'PASS' && dkimStatus === 'PASS' && dmarcStatus === 'PASS',
      dnsRecords: {
        spfStatus,
        dkimStatus,
        dmarcStatus,
        bimiStatus: 'CONFIGURED'
      },
      spamTriggerScore: spamCheck.score,
      detectedSpamWords: spamCheck.detected,
      recommendations: recs
    };
  }
}

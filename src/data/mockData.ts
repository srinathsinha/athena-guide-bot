import { Expert, KnowledgeGap, AthenaDailyDigest, KnowledgeGraphArea } from '@/types/athena';

export const mockExperts: Expert[] = [
  {
    id: 'alice',
    name: 'Alice Chen',
    avatar: '/placeholder.svg',
    slackHandle: '@alice',
    specialties: ['Payments', 'Stripe Integration', 'Error Handling']
  },
  {
    id: 'bob',
    name: 'Bob Williams',
    avatar: '/placeholder.svg',
    slackHandle: '@bob',
    specialties: ['Feature Flags', 'Billing Core', 'Infrastructure']
  },
  {
    id: 'charlie',
    name: 'Charlie Rodriguez',
    avatar: '/placeholder.svg',
    slackHandle: '@charlie',
    specialties: ['Team Lead', 'Architecture', 'Code Review']
  }
];

export const mockKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'retry-logic-stripe',
    title: 'Retry Logic in `stripe.chargeCustomer()`',
    component: 'payments-core',
    confidence: 96,
    action: 'auto-pr',
    expert: mockExperts[0], // Alice
    nominatedBy: mockExperts[2], // Charlie
    incident: '#1129',
    patterns: [
      {
        id: 'no-retry',
        label: '🅰️',
        description: 'No retry',
        isRecommended: false,
        repoLink: 'https://github.com/company/payments-core/blob/a1b2c3d/src/stripe-legacy.ts#L45',
        commitInfo: {
          sha: 'a1b2c3d',
          message: 'Initial stripe integration',
          author: 'john-dev',
          date: '2024-01-15'
        }
      },
      {
        id: 'manual-retry',
        label: '🅱️',
        description: 'Manual loop with fixed delay',
        isRecommended: false,
        repoLink: 'https://github.com/company/payments-core/blob/f4e5d6c/src/stripe-manual.ts#L52',
        commitInfo: {
          sha: 'f4e5d6c',
          message: 'Add basic retry to stripe calls',
          author: 'sarah-dev',
          date: '2024-02-03'
        }
      },
      {
        id: 'safe-retry',
        label: '🆎',
        description: 'Uses resolveSafeRetry() with exponential backoff and logging',
        isRecommended: true,
        repoLink: 'https://github.com/company/payments-core/blob/g7h8i9j/src/stripe-safe.ts#L31',
        commitInfo: {
          sha: 'g7h8i9j',
          message: 'Implement safe retry pattern with exponential backoff',
          author: 'alice-chen',
          date: '2024-03-12'
        }
      }
    ]
  },
  {
    id: 'feature-flag-invoice',
    title: 'Feature Flag Guard in `async_invoice_dispatch`',
    component: 'billing-core',
    confidence: 83,
    action: 'ask-expert',
    expert: mockExperts[1], // Bob
    nominatedBy: mockExperts[2], // Charlie
    incident: '#1342',
    incidentLinks: [
      { id: '#1342', url: 'https://github.com/company/billing-core/pull/1342', title: 'Fix: Premature invoice dispatch in staging' },
      { id: '#1289', url: 'https://github.com/company/billing-core/pull/1289', title: 'Hotfix: Invoice processing without flag check' }
    ],
    reasoning: 'Pattern C ensures feature flag control with observability. Without logging (B), we lose visibility into flag effectiveness. Without flag checks (A), we risk uncontrolled rollouts.',
    patterns: [
      {
        id: 'no-flag-check',
        label: '🅰️',
        description: 'No flag check',
        isRecommended: false,
        repoLink: 'https://github.com/company/billing-core/blob/main/src/invoice-bad.ts#L23'
      },
      {
        id: 'flag-no-logging',
        label: '🅱️',
        description: 'Flag check without fallback logging',
        isRecommended: false,
        repoLink: 'https://github.com/company/billing-core/blob/main/src/invoice-partial.ts#L31'
      },
      {
        id: 'flag-with-logging',
        label: 'C',
        description: 'Flag check + logging fallback',
        isRecommended: true,
        repoLink: 'https://github.com/company/billing-core/blob/main/src/invoice-good.ts#L28'
      }
    ]
  }
];

export const mockGraphAreas: KnowledgeGraphArea[] = [
  {
    name: 'Retry Logic',
    component: 'payments-core',
    score: 100,
    status: 'verified',
    expert: mockExperts[0]
  },
  {
    name: 'Feature Flags',
    component: 'billing-core',
    score: 85,
    status: 'in-progress',
    expert: mockExperts[1]
  },
  {
    name: 'Auth Checks',
    component: 'payments-service',
    score: 0,
    status: 'unknown'
  }
];

export const mockDailyDigest: AthenaDailyDigest = {
  date: new Date().toISOString().split('T')[0],
  gaps: mockKnowledgeGaps,
  overallScore: 74,
  graphAreas: mockGraphAreas
};

export const getUpdatedDigestAfterApproval = (approvedGapId: string): AthenaDailyDigest => ({
  ...mockDailyDigest,
  overallScore: 77, // Increased by 3%
  gaps: mockDailyDigest.gaps.map(gap => 
    gap.id === approvedGapId 
      ? { ...gap, status: 'approved' as const }
      : gap
  )
});
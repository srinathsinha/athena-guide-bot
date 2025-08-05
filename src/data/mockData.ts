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
        isRecommended: false
      },
      {
        id: 'manual-retry',
        label: '🅱️',
        description: 'Manual loop with fixed delay',
        isRecommended: false
      },
      {
        id: 'safe-retry',
        label: '🆎',
        description: 'Uses resolveSafeRetry() with exponential backoff and logging',
        isRecommended: true
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
    patterns: [
      {
        id: 'no-flag-check',
        label: '🅰️',
        description: 'No flag check',
        isRecommended: false
      },
      {
        id: 'flag-no-logging',
        label: '🅱️',
        description: 'Flag check without fallback logging',
        isRecommended: false
      },
      {
        id: 'flag-with-logging',
        label: '🆎',
        description: 'Flag check + logging fallback',
        isRecommended: true
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
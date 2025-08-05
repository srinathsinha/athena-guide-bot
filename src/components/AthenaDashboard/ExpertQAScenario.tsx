import { useState } from 'react';
import { SlackMessage } from '@/components/SlackUI/SlackMessage';
import { SlackThread } from '@/components/SlackUI/SlackThread';
import { PatternSelector } from './PatternSelector';
import { KnowledgeProgressBar } from './KnowledgeProgressBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KnowledgeGap } from '@/types/athena';
import { FileText, ExternalLink, AlertTriangle } from 'lucide-react';

interface ExpertQAScenarioProps {
  gap: KnowledgeGap;
  onComplete?: () => void;
}

export function ExpertQAScenario({ gap, onComplete }: ExpertQAScenarioProps) {
  const [selectedPattern, setSelectedPattern] = useState<string>();
  const [showExpertResponse, setShowExpertResponse] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);

  const athenaBot = {
    name: 'Athena',
    avatar: '/placeholder.svg',
    handle: '@athena',
    isBot: true
  };

  const expert = {
    name: gap.expert.name,
    avatar: gap.expert.avatar,
    handle: gap.expert.slackHandle
  };

  const handlePatternSelect = (patternId: string) => {
    setSelectedPattern(patternId);
    setShowExpertResponse(true);
    setTimeout(() => {
      setShowUpdate(true);
      // Auto-complete and return to digest after documentation is shown
      setTimeout(() => {
        onComplete?.();
      }, 3000);
    }, 1000);
  };

  return (
    <SlackThread title="resolve-ai-feedback">
      <SlackMessage
        author={athenaBot}
        timestamp="9:15 AM"
      >
        <div className="space-y-4">
          <p>🚨 <strong>High Priority:</strong> 3 production incidents this week traced to inconsistent <code>async_invoice_dispatch</code> feature flag usage</p>
          
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="font-medium text-red-800">Impact Summary</span>
            </div>
            <div className="text-sm text-red-700 space-y-1">
              <p>• $47K in failed invoice processing</p>
              <p>• 2.3 hours average resolution time</p>
              <p>• 5 different implementation patterns found across codebase</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">Recent incidents:</span>
            </div>
            {gap.incidentLinks?.map((incident) => (
              <div key={incident.id} className="ml-4 text-sm">
                <a 
                  href={incident.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline flex items-center gap-1"
                >
                  {incident.id}: {incident.title}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <p className="text-blue-800 text-sm">
              🤖 <strong>My analysis:</strong> We should standardize on Pattern C (enhanced with metrics + logging) to prevent future incidents and improve observability. Options in :thread:
            </p>
          </div>
        </div>
      </SlackMessage>

      <SlackMessage
        author={athenaBot}
        timestamp="9:20 AM"
        isThread
      >
        <div className="space-y-4">
          <p>📞 Requesting expert input from <strong>{gap.expert.slackHandle}</strong></p>
          <div className="text-sm text-muted-foreground ml-4">
            <p>• Domain: Billing & Feature Flags</p>
            <p>• Nominated by: {gap.nominatedBy.slackHandle}</p>
            <p>• Response time: Usually &lt; 30min</p>
          </div>
          
          <div className="space-y-4">
            <p className="font-medium">🔍 Found these implementation patterns in our codebase:</p>
            
            <div className="space-y-3 pl-4">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handlePatternSelect('pattern-a')}
                  className={`text-2xl hover:scale-110 transition-transform ${selectedPattern === 'pattern-a' ? 'bg-primary/10 rounded p-1' : 'hover:bg-muted/50 rounded p-1'}`}
                >
                  🅐️
                </button>
                <div className="flex-1">
                  <div className="font-medium">Simple flag check</div>
                  <div className="bg-gray-900 text-gray-100 p-2 rounded text-xs font-mono mt-1">
                    <div className="text-green-400">// Pattern A: Check flag then enqueue</div>
                    <div>if (isFeatureEnabled("async_invoice_dispatch")) {`{`}</div>
                    <div className="ml-4">await enqueueInvoice(invoiceData);</div>
                    <div>{`}`}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <button
                  onClick={() => handlePatternSelect('pattern-b')}
                  className={`text-2xl hover:scale-110 transition-transform ${selectedPattern === 'pattern-b' ? 'bg-primary/10 rounded p-1' : 'hover:bg-muted/50 rounded p-1'}`}
                >
                  🅑️
                </button>
                <div className="flex-1">
                  <div className="font-medium">Flag check with logging</div>
                  <div className="bg-gray-900 text-gray-100 p-2 rounded text-xs font-mono mt-1">
                    <div className="text-green-400">// Pattern B: Check flag with logging</div>
                    <div>if (isFeatureEnabled("async_invoice_dispatch")) {`{`}</div>
                    <div className="ml-4">await enqueueInvoice(invoiceData);</div>
                    <div>{`}`} else {`{`}</div>
                    <div className="ml-4">logger.info("async_invoice_dispatch disabled");</div>
                    <div>{`}`}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <button
                  onClick={() => handlePatternSelect('pattern-c')}
                  className={`text-2xl hover:scale-110 transition-transform ${selectedPattern === 'pattern-c' ? 'bg-primary/10 rounded p-1' : 'hover:bg-muted/50 rounded p-1'}`}
                >
                  🅲️
                </button>
                <div className="flex-1">
                  <div className="font-medium">Enhanced with metrics **Recommended**</div>
                  <div className="bg-gray-900 text-gray-100 p-2 rounded text-xs font-mono mt-1">
                    <div className="text-green-400">// Pattern C: Enhanced with metrics</div>
                    <div>if (isFeatureEnabled("async_invoice_dispatch")) {`{`}</div>
                    <div className="ml-4">metrics.increment("invoice.async.enabled");</div>
                    <div className="ml-4">await enqueueInvoice(invoiceData);</div>
                    <div>{`}`} else {`{`}</div>
                    <div className="ml-4">metrics.increment("invoice.async.disabled");</div>
                    <div className="ml-4">logger.info("async_invoice_dispatch disabled");</div>
                    <div>{`}`}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="mt-4">
              👆 {gap.expert.slackHandle}, which pattern should we standardize on? Click the emoji above each pattern to indicate your choice.
            </p>
          </div>
        </div>
      </SlackMessage>

      {showExpertResponse && (
        <SlackMessage
          author={expert}
          timestamp="9:35 AM"
          isThread
        >
          <div className="space-y-3">
            <p>🅲️ <strong>Pattern C is the way to go.</strong></p>
            <div className="bg-green-50 border border-green-200 rounded p-3">
              <p className="text-green-800 text-sm font-medium mb-2">Why Pattern C:</p>
              <div className="text-sm text-green-700 space-y-1">
                <p>• ✅ Aligns with our observability rollout policy</p>
                <p>• ✅ Metrics help us track adoption rates and make data-driven decisions</p>
                <p>• ✅ Logging catches unexpected behavior during rollouts</p>
                <p>• ✅ We can detect feature flag performance impact</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              The metrics are crucial - we've had 3 feature flags this quarter where we couldn't tell if low adoption was due to bugs or user behavior. With Pattern C, we'll have the data to make the right call.
            </p>
          </div>
        </SlackMessage>
      )}

      {showUpdate && (
        <>
          <SlackMessage
            author={athenaBot}
            timestamp="9:36 AM"
            isThread
          >
            <div className="space-y-4">
              <p>✅ Thanks {gap.expert.slackHandle}!</p>
              <p>📚 I've updated the internal documentation with the validated pattern and added test guidance.</p>
              
              <div className="space-y-2">
                <p className="font-medium">🧠 Knowledge Graph Updated</p>
                <p className="text-sm">→ `async_invoice_dispatch` in `billing-core`: 0.7 → 1.0</p>
                <p className="text-sm">📈 Score: 83% → 85%</p>
                <KnowledgeProgressBar score={85} />
              </div>
              
              <div className="space-y-2">
                <p className="font-medium">Current Graph View:</p>
                <div className="text-sm space-y-1">
                  <p>→ Retry Logic (payments-core): ✅ Verified by @Alice</p>
                  <p>→ Feature Flags (billing-core): ✅ Verified by {gap.expert.slackHandle}</p>
                  <p>→ Auth Checks (payments-service): ❓ Unknown</p>
                </div>
              </div>
              
              <div className="flex gap-2 text-xs">
                <Button variant="link" size="sm" className="p-0 h-auto">
                  🙏 Want to help? [Answer Next Question]
                </Button>
                <Button variant="link" size="sm" className="p-0 h-auto">|</Button>
                <Button variant="link" size="sm" className="p-0 h-auto">
                  [Nominate Expert]
                </Button>
              </div>
            </div>
          </SlackMessage>

          {/* Documentation Preview */}
          <div className="p-3 bg-muted/20">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-4 w-4" />
                  Documentation Updated
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    <a 
                      href="https://github.com/company/docs/blob/main/feature-flags.md" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-sm text-blue-500 hover:underline"
                    >
                      /docs/feature-flags.md
                    </a>
                  </div>
                  <p className="text-xs text-muted-foreground">Section: Async Invoice Dispatch</p>
                </div>
                
                <div className="text-sm font-mono bg-muted p-3 rounded space-y-2">
                  <p className="font-medium">## Async Invoice Dispatch (Feature Flag)</p>
                  <p>✅ Always check `isFeatureEnabled('async_invoice_dispatch')` before enqueue</p>
                  <p>✅ Log when flag is disabled for observability</p>
                  <p>❌ Do not call dispatch logic unguarded</p>
                  <p>❌ Avoid dynamically constructing flag names</p>
                </div>
                
                <div className="flex gap-2">
                  <a 
                    href="https://github.com/company/docs/blob/main/feature-flags.md" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      View Documentation
                    </Button>
                  </a>
                  <a 
                    href="https://github.com/company/docs/blob/main/README.md" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      View README
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </SlackThread>
  );
}
import athenaAvatar from '@/assets/athena-bot-avatar.jpg';
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
  const [showOptions, setShowOptions] = useState(false);

  const athenaBot = {
    name: 'Athena',
    avatar: athenaAvatar,
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
          
          <div className="pl-4 border-l-2 border-red-400">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-red-600">Impact Summary</span>
            </div>
            <div className="text-sm space-y-1">
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
                <span className="text-blue-400 hover:underline cursor-pointer">
                  {incident.id}: {incident.title}
                </span>
              </div>
            ))}
          </div>

          <div className="pl-4 border-l-2 border-blue-400">
            <p className="text-sm">
              🤖 <strong>My analysis:</strong> We should standardize on Pattern C (enhanced with metrics + logging) to prevent future incidents and improve observability.
            </p>
            <button 
              onClick={() => setShowOptions(!showOptions)}
              className="text-blue-400 text-sm mt-2 hover:underline flex items-center gap-1"
            >
              <span className={`transform transition-transform ${showOptions ? 'rotate-90' : ''}`}>▶</span>
              Options in 🧵
            </button>
          </div>
        </div>
      </SlackMessage>

      {showOptions && (
        <SlackMessage
          author={athenaBot}
          timestamp="9:20 AM"
          isThread
        >
          <div className="space-y-4">
            <p>📞 Requesting expert input from <strong>{gap.expert.slackHandle}</strong></p>
            
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
      )}

      {showExpertResponse && (
        <SlackMessage
          author={expert}
          timestamp="9:35 AM"
          isThread
        >
          <div className="space-y-3">
            <p>🅲️ <strong>Pattern C is the way to go.</strong></p>
            <div className="space-y-1">
              <p className="text-sm font-medium mb-2">Why Pattern C:</p>
              <div className="text-sm space-y-1">
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
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Want to help? Answer Next Question
                </Button>
                <Button variant="outline" size="sm">
                  Nominate Expert
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
                    <span className="font-medium text-sm text-blue-400 hover:underline cursor-pointer">
                      /docs/feature-flags.md
                    </span>
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
                  <Button variant="outline" size="sm">
                    View Documentation
                  </Button>
                  <Button variant="outline" size="sm">
                    View README
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </SlackThread>
  );
}
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
        timestamp="9:20 AM"
      >
        <div className="space-y-4">
          <p>🤔 Athena: Inconsistent usage of `{gap.title.split('`')[1]}` feature flag detected</p>
          
          <div className="flex items-center gap-2">
            <p>🛠️ Confidence: {gap.confidence}% → Needs expert review</p>
            <Badge variant="secondary">Medium Confidence</Badge>
          </div>
          
          <p>👨‍💻 Expert: {gap.expert.slackHandle} (nominated by {gap.nominatedBy.slackHandle})</p>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span className="font-medium">Root-cause incidents:</span>
            </div>
            {gap.incidentLinks?.map((incident) => (
              <div key={incident.id} className="ml-6">
                <a 
                  href={incident.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline flex items-center gap-1 text-sm"
                >
                  {incident.id}: {incident.title}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            ))}
          </div>

          {gap.reasoning && (
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-medium">🤖 Athena's analysis:</span>
              </div>
              <p className="text-sm text-blue-800 mt-1">{gap.reasoning}</p>
            </div>
          )}
          
          <div className="space-y-2">
            <p className="font-medium">📍 Summary of existing patterns found (choose the respective emoji to indicate your choice):</p>
            <div className="space-y-1">
              {gap.patterns.map((pattern) => (
                <div key={pattern.id}>
                  <button
                    onClick={() => handlePatternSelect(pattern.id)}
                    className={`text-left w-full p-2 rounded hover:bg-muted/50 ${selectedPattern === pattern.id ? 'bg-primary/10' : ''}`}
                  >
                    <span className="font-mono text-lg mr-2">{pattern.label}</span>
                    <span className="text-sm">{pattern.description}</span>
                    {pattern.repoLink && (
                      <span className="text-blue-500 hover:underline text-xs ml-2">
                        <a href={pattern.repoLink} target="_blank" rel="noopener noreferrer">
                          [code]
                        </a>
                      </span>
                    )}
                    {pattern.isRecommended && (
                      <span className="text-xs text-primary ml-2">🤖 Athena recommends</span>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SlackMessage>

      {showExpertResponse && (
        <SlackMessage
          author={expert}
          timestamp="9:35 AM"
          isThread
        >
          <div className="space-y-2">
            <p>Pattern C is correct. Aligns with rollout policy + logs behavior.</p>
            <p className="text-sm text-muted-foreground">
              "Always check the flag first, and log when disabled for observability. 
              This helps us track feature adoption and debug issues."
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
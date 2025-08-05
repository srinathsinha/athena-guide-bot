import { useState } from 'react';
import { SlackMessage } from '@/components/SlackUI/SlackMessage';
import { SlackThread } from '@/components/SlackUI/SlackThread';
import { PatternSelector } from './PatternSelector';
import { KnowledgeProgressBar } from './KnowledgeProgressBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KnowledgeGap } from '@/types/athena';
import { FileText } from 'lucide-react';

interface ExpertQAScenarioProps {
  gap: KnowledgeGap;
}

export function ExpertQAScenario({ gap }: ExpertQAScenarioProps) {
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
    setTimeout(() => setShowUpdate(true), 1000);
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
          
          <p>🧨 Linked Incident: {gap.incident} (premature dispatch in staging)</p>
          
          <PatternSelector
            patterns={gap.patterns}
            selectedPattern={selectedPattern}
            onSelect={handlePatternSelect}
          />
          
          <p className="text-sm">{gap.expert.slackHandle}, which pattern should be standardized?</p>
        </div>
      </SlackMessage>

      {showExpertResponse && (
        <SlackMessage
          author={expert}
          timestamp="9:35 AM"
          isThread
        >
          <div className="space-y-2">
            <p>Pattern 🆎 is correct. Aligns with rollout policy + logs behavior.</p>
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
                <div>
                  <p className="font-medium text-sm">File: /docs/feature-flags.md</p>
                  <p className="text-xs text-muted-foreground">Section: Async Invoice Dispatch</p>
                </div>
                
                <div className="text-sm font-mono bg-muted p-3 rounded space-y-2">
                  <p className="font-medium">## Async Invoice Dispatch (Feature Flag)</p>
                  <p>✅ Always check `isFeatureEnabled('async_invoice_dispatch')` before enqueue</p>
                  <p>✅ Log when flag is disabled for observability</p>
                  <p>❌ Do not call dispatch logic unguarded</p>
                  <p>❌ Avoid dynamically constructing flag names</p>
                </div>
                
                <Button variant="outline" size="sm">
                  View Full Documentation
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </SlackThread>
  );
}
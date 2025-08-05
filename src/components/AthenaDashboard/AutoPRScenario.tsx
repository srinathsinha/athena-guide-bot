import { SlackMessage } from '@/components/SlackUI/SlackMessage';
import { SlackThread } from '@/components/SlackUI/SlackThread';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KnowledgeGap } from '@/types/athena';
import { GitPullRequest, ExternalLink } from 'lucide-react';

interface AutoPRScenarioProps {
  gap: KnowledgeGap;
  onApprove: () => void;
  onReject: () => void;
}

export function AutoPRScenario({ gap, onApprove, onReject }: AutoPRScenarioProps) {
  const athenaBot = {
    name: 'Athena',
    avatar: '/placeholder.svg',
    handle: '@athena',
    isBot: true
  };

  return (
    <SlackThread title="resolve-ai-feedback">
      <SlackMessage
        author={athenaBot}
        timestamp="9:15 AM"
        actions={
          <div className="flex gap-2">
            <Button size="sm" onClick={onApprove}>
              <GitPullRequest className="h-4 w-4 mr-1" />
              View Proposed PR
            </Button>
            <Button variant="outline" size="sm" onClick={onApprove}>
              Approve
            </Button>
            <Button variant="outline" size="sm" onClick={onReject}>
              Reject
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p>🔁 Athena: High-confidence knowledge match found in retry logic for `{gap.component}`</p>
          
          <p>📄 Auto-PR prepared based on prior patterns + incident {gap.incident}</p>
          
          <div className="flex items-center gap-2">
            <p>🎯 Confidence: {gap.confidence}% → Proceeding with proposed refactor</p>
            <Badge variant="secondary">High Confidence</Badge>
          </div>
          
          <p>👩‍💻 Expert: {gap.expert.slackHandle} (nominated by {gap.nominatedBy.slackHandle})</p>
          
          <div className="space-y-2">
            <p className="font-medium">📍 Summary of existing patterns:</p>
            
            <div className="space-y-1">
              {gap.patterns.map((pattern) => (
                <div key={pattern.id} className="flex items-center gap-2">
                  <span className="font-mono">{pattern.label}</span>
                  <span className="text-sm">{pattern.description}</span>
                  {pattern.isRecommended && <span>✅</span>}
                </div>
              ))}
            </div>
            
            <p className="text-sm font-medium mt-3">
              ✅ Proposed: Refactor 🅰️ and 🅱️ to match 🆎
            </p>
          </div>
        </div>
      </SlackMessage>
      
      {/* GitHub PR Preview */}
      <div className="p-3 bg-muted/20">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <GitPullRequest className="h-4 w-4" />
              GitHub PR Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-medium text-sm">Title:</p>
              <p className="text-sm font-mono bg-muted p-2 rounded">
                [resolve-ai] Standardize Retry Logic in stripe.chargeCustomer()
              </p>
            </div>
            
            <div>
              <p className="font-medium text-sm">Commit Message:</p>
              <p className="text-sm font-mono bg-muted p-2 rounded">
                Standardize retry logic with exponential backoff and logging
                
                - Refactor to use resolveSafeRetry() pattern
                - Add proper error logging and incident tracking
                - Reference: incident {gap.incident}
                - Expert: {gap.expert.slackHandle}
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <span>Reviewer:</span>
              <Badge variant="outline">{gap.expert.slackHandle}</Badge>
            </div>
            
            <Button variant="outline" size="sm">
              <ExternalLink className="h-3 w-3 mr-1" />
              Open in GitHub
            </Button>
          </CardContent>
        </Card>
      </div>
    </SlackThread>
  );
}
import { SlackMessage } from '@/components/SlackUI/SlackMessage';
import { SlackThread } from '@/components/SlackUI/SlackThread';
import { KnowledgeProgressBar } from './KnowledgeProgressBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AthenaDailyDigest } from '@/types/athena';

interface AthenaDigestProps {
  digest: AthenaDailyDigest;
  onViewThread: (gapId: string) => void;
}

export function AthenaDigest({ digest, onViewThread }: AthenaDigestProps) {
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
        timestamp="9:00 AM"
      >
        <div className="space-y-4">
          <p>👋 Good morning, here's your daily update from Athena.</p>
          
          <p>🧠 We found {digest.gaps.length} high-impact knowledge gaps to resolve today:</p>
          
          <div className="space-y-3">
            {digest.gaps.map((gap, index) => (
              <div key={gap.id} className="border-l-4 border-primary/20 pl-4">
                <div className="space-y-1">
                  <p className="font-medium">
                    {index + 1}️⃣ {gap.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    • Confidence: {gap.confidence}%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    • Action: {gap.action === 'auto-pr' ? 'Propose Auto-PR' : 'Ask Expert'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    • Tagged Expert: {gap.expert.slackHandle} (nominated by {gap.nominatedBy.slackHandle})
                  </p>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="p-0 h-auto text-xs"
                    onClick={() => onViewThread(gap.id)}
                  >
                    → [View Thread]
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <p>📈 Current Graph Score: {digest.overallScore}%</p>
            <KnowledgeProgressBar score={digest.overallScore} />
            <div className="flex gap-2 text-xs">
              <Button variant="link" size="sm" className="p-0 h-auto">→ [View Coverage]</Button>
              <Button variant="link" size="sm" className="p-0 h-auto">|</Button>
              <Button variant="link" size="sm" className="p-0 h-auto">[Nominate Expert]</Button>
              <Button variant="link" size="sm" className="p-0 h-auto">|</Button>
              <Button variant="link" size="sm" className="p-0 h-auto">[Help Improve]</Button>
            </div>
          </div>
        </div>
      </SlackMessage>
    </SlackThread>
  );
}
import { SlackMessage } from '@/components/SlackUI/SlackMessage';
import { SlackThread } from '@/components/SlackUI/SlackThread';
import { KnowledgeProgressBar } from './KnowledgeProgressBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AthenaDailyDigest } from '@/types/athena';

interface AthenaDigestProps {
  digest: AthenaDailyDigest;
  onViewThread: (gapId: string) => void;
  approvedGaps?: Set<string>;
}

export function AthenaDigest({ digest, onViewThread, approvedGaps }: AthenaDigestProps) {
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
        <div className="space-y-3">
          <p>👋 Good morning, here's your daily update from Athena, your knowledge companion.</p>
          
          <p>🧠 We found <strong>{digest.gaps.length} high-impact knowledge gaps</strong> to resolve today:</p>
          
          <div className="space-y-4 mt-4">
            {digest.gaps.map((gap, index) => {
              const isApproved = approvedGaps?.has(gap.id);
              return (
                <div key={gap.id} className="pl-4">
                  <p className="font-medium flex items-center gap-2">
                    <span className="text-lg">{index + 1}️⃣</span> 
                    <strong>{gap.title}</strong>
                    {isApproved && <span className="text-green-500">✅</span>}
                  </p>
                  <div className="text-sm text-muted-foreground mt-1 space-y-0.5">
                    <p>• Confidence: <strong>{gap.confidence}%</strong></p>
                    <p>• Action: <span className="text-primary">{gap.action === 'auto-pr' ? 'Propose Auto-PR' : 'Ask Expert'}</span></p>
                    <p>• Tagged Expert: <span className="text-blue-400">{gap.expert.slackHandle}</span> (nominated by <span className="text-blue-400">{gap.nominatedBy.slackHandle}</span>)</p>
                    {isApproved ? (
                      <p className="text-green-500 text-sm font-medium">✅ Merged and deployed</p>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onViewThread(gap.id)}
                        className="text-xs"
                      >
                        View Thread
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 space-y-2">
            <p>📈 <strong>Current Graph Score: {digest.overallScore}%</strong></p>
            <KnowledgeProgressBar score={digest.overallScore} />
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" className="text-xs">
                View Coverage
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                Nominate Expert
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                Help Improve
              </Button>
            </div>
          </div>
        </div>
      </SlackMessage>
    </SlackThread>
  );
}
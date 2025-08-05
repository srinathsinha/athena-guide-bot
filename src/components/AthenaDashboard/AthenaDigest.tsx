import { useState, useEffect } from 'react';
import athenaAvatar from '@/assets/athena-goddess-avatar.webp';
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
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const athenaBot = {
    name: 'Athena',
    avatar: athenaAvatar,
    handle: '@athena',
    isBot: true
  };

  useEffect(() => {
    // Show first message immediately
    setVisibleMessages(1);
    
    // Show subsequent messages with 1 second delays
    const timer1 = setTimeout(() => setVisibleMessages(2), 1000);
    const timer2 = setTimeout(() => setVisibleMessages(3), 2000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <SlackThread title="resolve-ai-feedback">
      {visibleMessages >= 1 && (
        <div className="animate-fade-in">
          <SlackMessage
            author={athenaBot}
            timestamp="9:00 AM"
          >
        <div className="space-y-3">
          <p>👋 Good morning, here's your daily update from Athena, your knowledge companion.</p>
          
          <div className="space-y-2">
            <p>📈 <strong>Current Graph Score: {digest.overallScore}%</strong></p>
            <KnowledgeProgressBar score={digest.overallScore} />
          </div>
          
          <p>🧠 We found <strong>{digest.gaps.length} high-impact knowledge gaps</strong> to resolve today:</p>
        </div>
          </SlackMessage>
        </div>
      )}

      {digest.gaps.map((gap, index) => {
        const isApproved = approvedGaps?.has(gap.id);
        return visibleMessages >= (index + 2) ? (
          <div key={gap.id} className="animate-fade-in">
            <SlackMessage
              author={athenaBot}
              timestamp={`9:0${index + 1} AM`}
            >
            <div className="space-y-3">
              <p className="font-medium flex items-center gap-2">
                <span className="text-lg">{index + 1}️⃣</span> 
                <strong>{gap.title}</strong>
                {isApproved && <span className="text-green-500">✅</span>}
              </p>
              <div className="text-sm text-muted-foreground space-y-0.5">
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
                    className="text-xs mt-2"
                  >
                    View Thread
                  </Button>
                )}
              </div>
            </div>
            </SlackMessage>
          </div>
        ) : null;
      })}
    </SlackThread>
  );
}
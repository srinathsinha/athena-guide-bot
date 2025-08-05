interface KnowledgeProgressBarProps {
  score: number;
  maxScore?: number;
}

export function KnowledgeProgressBar({ score, maxScore = 100 }: KnowledgeProgressBarProps) {
  const percentage = Math.min((score / maxScore) * 100, 100);
  const filledBlocks = Math.floor(percentage / 10);
  const totalBlocks = 10;
  
  const progressBar = '█'.repeat(filledBlocks) + '░'.repeat(totalBlocks - filledBlocks);
  
  return (
    <div className="font-mono text-sm">
      <div className="flex items-center gap-2">
        <span className="text-primary">[{progressBar}]</span>
        <span className="text-muted-foreground">{score}%</span>
      </div>
    </div>
  );
}
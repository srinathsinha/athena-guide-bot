import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Pattern {
  id: string;
  label: string;
  description: string;
  isRecommended: boolean;
}

interface PatternSelectorProps {
  patterns: Pattern[];
  selectedPattern?: string;
  onSelect: (patternId: string) => void;
}

export function PatternSelector({ patterns, selectedPattern, onSelect }: PatternSelectorProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">📍 Observed patterns:</p>
      
      <div className="space-y-2">
        {patterns.map((pattern) => (
          <div key={pattern.id} className="flex items-center gap-3">
            <Button
              variant={selectedPattern === pattern.id ? "default" : "outline"}
              size="sm"
              onClick={() => onSelect(pattern.id)}
              className="w-12 h-8"
            >
              {pattern.label}
            </Button>
            
            <div className="flex-1 flex items-center gap-2">
              <span className="text-sm">{pattern.description}</span>
              {pattern.isRecommended && (
                <Badge variant="secondary" className="text-xs">✅</Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import { SlackAvatar } from './SlackAvatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SlackMessageProps {
  author: {
    name: string;
    avatar?: string;
    handle?: string;
    isBot?: boolean;
  };
  timestamp: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  isThread?: boolean;
}

export function SlackMessage({ author, timestamp, children, actions, isThread = false }: SlackMessageProps) {
  const initials = author.name.split(' ').map(n => n[0]).join('').toUpperCase();
  
  return (
    <div className={`flex gap-3 p-3 hover:bg-muted/30 ${isThread ? 'ml-11 border-l-2 border-muted pl-6' : ''}`}>
      <SlackAvatar 
        src={author.avatar}
        alt={author.name}
        fallback={initials}
        size="md"
        status="online"
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm">{author.name}</span>
          {author.isBot && (
            <Badge variant="secondary" className="text-xs">BOT</Badge>
          )}
          <span className="text-xs text-muted-foreground">{timestamp}</span>
        </div>
        
        <div className="text-sm leading-relaxed">
          {children}
        </div>
        
        {actions && (
          <div className="mt-3 flex gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SlackAvatarProps {
  src?: string;
  alt: string;
  fallback: string;
  size?: 'sm' | 'md' | 'lg';
  status?: 'online' | 'away' | 'offline';
}

export function SlackAvatar({ src, alt, fallback, size = 'md', status }: SlackAvatarProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8', 
    lg: 'h-10 w-10'
  };

  return (
    <div className="relative">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={src} alt={alt} />
        <AvatarFallback className="text-xs bg-muted">{fallback}</AvatarFallback>
      </Avatar>
      {status && (
        <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${
          status === 'online' ? 'bg-green-500' : 
          status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
        }`} />
      )}
    </div>
  );
}
import { Card, CardContent } from '@/components/ui/card';

interface SlackThreadProps {
  children: React.ReactNode;
  title?: string;
}

export function SlackThread({ children, title }: SlackThreadProps) {
  return (
    <Card className="max-w-4xl mx-auto">
      {title && (
        <div className="px-4 py-2 border-b bg-muted/30">
          <h3 className="font-semibold text-sm">#{title}</h3>
        </div>
      )}
      <CardContent className="p-0">
        {children}
      </CardContent>
    </Card>
  );
}
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { IssuePriority } from '@/types/database';
import { PRIORITY_LABELS } from '@/types/database';
import { AlertTriangle, ArrowDown, ArrowUp, Flame } from 'lucide-react';

interface PriorityBadgeProps {
  priority: IssuePriority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const getPriorityConfig = () => {
    switch (priority) {
      case 'low':
        return {
          className: 'bg-muted text-muted-foreground border-border',
          icon: ArrowDown,
        };
      case 'medium':
        return {
          className: 'bg-primary/10 text-primary border-primary/20',
          icon: ArrowUp,
        };
      case 'high':
        return {
          className: 'bg-warning/10 text-warning border-warning/20',
          icon: AlertTriangle,
        };
      case 'urgent':
        return {
          className: 'bg-destructive/10 text-destructive border-destructive/20',
          icon: Flame,
        };
    }
  };

  const config = getPriorityConfig();
  const Icon = config.icon;

  return (
    <Badge 
      variant="outline" 
      className={cn('gap-1.5', config.className, className)}
    >
      <Icon className="h-3 w-3" />
      {PRIORITY_LABELS[priority]}
    </Badge>
  );
}

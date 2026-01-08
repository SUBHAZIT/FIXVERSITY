import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { IssueStatus } from '@/types/database';
import { STATUS_LABELS } from '@/types/database';
import { CheckCircle2, Clock, Loader2 } from 'lucide-react';

interface StatusBadgeProps {
  status: IssueStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'open':
        return {
          variant: 'default' as const,
          className: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20',
          icon: Clock,
        };
      case 'in_progress':
        return {
          variant: 'default' as const,
          className: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20',
          icon: Loader2,
        };
      case 'resolved':
        return {
          variant: 'default' as const,
          className: 'bg-success/10 text-success border-success/20 hover:bg-success/20',
          icon: CheckCircle2,
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Badge 
      variant={config.variant} 
      className={cn('gap-1.5 border', config.className, className)}
    >
      <Icon className={cn('h-3 w-3', status === 'in_progress' && 'animate-spin')} />
      {STATUS_LABELS[status]}
    </Badge>
  );
}

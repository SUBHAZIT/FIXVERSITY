import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { CategoryIcon } from './CategoryIcon';
import { StarRating } from './StarRating';
import type { Issue, Profile } from '@/types/database';
import { CATEGORY_LABELS } from '@/types/database';
import { Calendar, MapPin, User, MessageSquare, Clock, Timer } from 'lucide-react';
import { formatDistanceToNow, differenceInHours, differenceInDays } from 'date-fns';
import { Link } from 'react-router-dom';
import { useRateIssue, useWorkerRatings } from '@/hooks/useIssues';

interface IssueCardProps {
  issue: Issue & { worker?: Profile | null; estimated_time?: number | null };
  showWorkerInfo?: boolean;
}

function formatEstimatedTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
}

function formatResolutionTime(createdAt: string, resolvedAt: string): string {
  const start = new Date(createdAt);
  const end = new Date(resolvedAt);
  const hours = differenceInHours(end, start);
  const days = differenceInDays(end, start);
  
  if (days > 0) {
    const remainingHours = hours % 24;
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
  }
  return hours > 0 ? `${hours}h` : 'Less than 1h';
}

export function IssueCard({ issue, showWorkerInfo = false }: IssueCardProps) {
  const hasWorkerInfo = showWorkerInfo && (issue.worker || issue.admin_notes || issue.resolved_at || issue.estimated_time);
  const rateIssue = useRateIssue();
  const isResolved = issue.status === 'resolved';
  const canRate = isResolved && !issue.rating && showWorkerInfo;
  const { data: workerRatings } = useWorkerRatings();
  const workerRating = workerRatings?.find((r) => r.workerId === issue.assigned_to);
  
  return (
    <Link to={`/issues/${issue.id}`}>
      <Card className="group hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 group-hover:scale-110 transition-transform">
                <CategoryIcon category={issue.category} className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-heading font-semibold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
                  {issue.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {CATEGORY_LABELS[issue.category]}
                </p>
              </div>
            </div>
            <StatusBadge status={issue.status} />
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {issue.description}
          </p>
          
          {/* Worker Info Section */}
          {hasWorkerInfo && (
            <div className="bg-muted/50 rounded-lg p-3 space-y-2 border border-border/50">
              {/* Assigned Worker */}
              {issue.worker && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Assigned to:</span>
                  <span className="font-medium">{issue.worker.full_name}</span>
                  {workerRating && (
                    <span className="text-xs text-muted-foreground ml-2">
                      ({workerRating.averageRating.toFixed(1)}★, {workerRating.ratingCount} ratings)
                    </span>
                  )}
                </div>
              )}
              
              {/* Not assigned yet */}
              {showWorkerInfo && !issue.worker && issue.status === 'open' && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground italic">Not assigned yet</span>
                </div>
              )}
              
              {/* Estimated Time */}
              {issue.estimated_time && !issue.resolved_at && (
                <div className="flex items-center gap-2 text-sm">
                  <Timer className="h-4 w-4 text-warning" />
                  <span className="text-muted-foreground">Estimated fix time:</span>
                  <span className="font-medium text-warning">
                    {formatEstimatedTime(issue.estimated_time)}
                  </span>
                </div>
              )}
              
              {/* Resolution Time */}
              {issue.resolved_at && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-success" />
                  <span className="text-muted-foreground">Fixed in:</span>
                  <span className="font-medium text-success">
                    {formatResolutionTime(issue.created_at, issue.resolved_at)}
                  </span>
                </div>
              )}
              
              {/* Worker Notes */}
              {issue.admin_notes && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Worker notes:</span>
                  </div>
                  <p className="text-sm pl-6 line-clamp-2">{issue.admin_notes}</p>
                </div>
              )}
              
              {/* Rating Section */}
              {isResolved && (
                <div className="pt-2 border-t border-border/50">
                  {issue.rating ? (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Your rating:</span>
                      <StarRating rating={issue.rating} readonly size="sm" />
                    </div>
                  ) : canRate ? (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Rate this fix:</span>
                      <StarRating 
                        rating={null} 
                        onRate={(rating) => rateIssue.mutate({ id: issue.id, rating })} 
                        size="sm" 
                      />
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          )}
          
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              <span>{issue.building} - {issue.room_number}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}</span>
            </div>
            <PriorityBadge priority={issue.priority} />
          </div>
          
          {issue.image_url && (
            <div className="relative rounded-lg overflow-hidden h-32">
              <img 
                src={issue.image_url} 
                alt="Issue" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

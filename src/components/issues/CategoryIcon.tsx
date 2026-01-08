import { cn } from '@/lib/utils';
import type { IssueCategory } from '@/types/database';
import { 
  Zap, 
  Droplets, 
  Wind, 
  Sparkles, 
  Monitor, 
  Armchair, 
  Shield, 
  HelpCircle 
} from 'lucide-react';

interface CategoryIconProps {
  category: IssueCategory;
  className?: string;
}

export function CategoryIcon({ category, className }: CategoryIconProps) {
  const getIcon = () => {
    switch (category) {
      case 'electrical':
        return Zap;
      case 'plumbing':
        return Droplets;
      case 'hvac':
        return Wind;
      case 'cleaning':
        return Sparkles;
      case 'it':
        return Monitor;
      case 'furniture':
        return Armchair;
      case 'safety':
        return Shield;
      case 'other':
        return HelpCircle;
    }
  };

  const Icon = getIcon();

  return <Icon className={cn('h-4 w-4', className)} />;
}

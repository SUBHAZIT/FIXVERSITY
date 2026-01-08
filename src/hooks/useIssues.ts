import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Issue, IssueStatus, IssueCategory, IssuePriority, Profile } from '@/types/database';
import { toast } from 'sonner';

interface CreateIssueData {
  title: string;
  description: string;
  category: IssueCategory;
  priority: IssuePriority;
  building: string;
  room_number: string;
  image_url?: string;
}

interface UpdateIssueData {
  id: string;
  status?: IssueStatus;
  priority?: IssuePriority;
  assigned_to?: string | null;
  admin_notes?: string;
  estimated_time?: number | null;
}

export interface IssueWithSubmitter extends Issue {
  submitter?: Profile | null;
}

export interface IssueWithWorker extends Issue {
  worker?: Profile | null;
}

export interface WorkerRating {
  workerId: string;
  averageRating: number;
  ratingCount: number;
}

export function useUserIssues() {
  const { user, isStudent, isFaculty } = useAuth();

  return useQuery({
    queryKey: ['issues', 'user', user?.id],
    queryFn: async () => {
      // First get all user's issues
      const { data: issues, error } = await supabase
        .from('issues')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Get unique assigned_to IDs
      const workerIds = [...new Set(issues?.map(i => i.assigned_to).filter(Boolean))] as string[];
      
      if (workerIds.length === 0) {
        return (issues || []).map(issue => ({ ...issue, worker: null })) as IssueWithWorker[];
      }
      
      // Fetch worker profiles - need to get profiles via user_id matching assigned_to
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', workerIds);

      if (profilesError) {
        // If we can't get profiles, just return issues without worker info
        return (issues || []).map(issue => ({ ...issue, worker: null })) as IssueWithWorker[];
      }

      // Map profiles to issues
      const profileMap = new Map(profiles?.map(p => [p.user_id, p]));
      
      const issuesWithWorkers: IssueWithWorker[] = issues?.map(issue => ({
        ...issue,
        worker: issue.assigned_to ? profileMap.get(issue.assigned_to) || null : null,
      })) || [];

      return issuesWithWorkers;
    },
    enabled: !!user && (isStudent || isFaculty),
  });
}

export function useWorkerIssues() {
  const { user, isWorker } = useAuth();

  return useQuery({
    queryKey: ['issues', 'worker', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('issues')
        .select('*')
        .eq('assigned_to', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Issue[];
    },
    enabled: !!user && isWorker,
  });
}

export function useAllIssues() {
  const { isAdmin } = useAuth();

  return useQuery({
    queryKey: ['issues', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('issues')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Issue[];
    },
    enabled: isAdmin,
  });
}

export function useAllIssuesWithSubmitters() {
  const { isAdmin } = useAuth();

  return useQuery({
    queryKey: ['issues', 'all', 'with-submitters'],
    queryFn: async () => {
      // First get all issues
      const { data: issues, error: issuesError } = await supabase
        .from('issues')
        .select('*')
        .order('created_at', { ascending: false });

      if (issuesError) throw issuesError;

      // Get unique user_ids
      const userIds = [...new Set(issues?.map(i => i.user_id).filter(Boolean))] as string[];
      
      // Fetch all profiles for those users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', userIds);

      if (profilesError) throw profilesError;

      // Map profiles to issues
      const profileMap = new Map(profiles?.map(p => [p.user_id, p]));
      
      const issuesWithSubmitters: IssueWithSubmitter[] = issues?.map(issue => ({
        ...issue,
        submitter: issue.user_id ? profileMap.get(issue.user_id) || null : null,
      })) || [];

      return issuesWithSubmitters;
    },
    enabled: isAdmin,
  });
}

export function useWorkerRatings() {
  const { isAdmin, isStudent, isFaculty, isWorker } = useAuth();

  return useQuery({
    queryKey: ['worker-ratings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('issues')
        .select('assigned_to, rating')
        .not('assigned_to', 'is', null)
        .not('rating', 'is', null);

      if (error) throw error;

      const ratingMap = new Map<string, { sum: number; count: number }>();

      (data || []).forEach((row: { assigned_to: string | null; rating: number | null }) => {
        if (!row.assigned_to || row.rating == null) return;
        const current = ratingMap.get(row.assigned_to) || { sum: 0, count: 0 };
        current.sum += row.rating;
        current.count += 1;
        ratingMap.set(row.assigned_to, current);
      });

      const result: WorkerRating[] = Array.from(ratingMap.entries()).map(([workerId, { sum, count }]) => ({
        workerId,
        averageRating: sum / count,
        ratingCount: count,
      }));

      return result;
    },
    enabled: isAdmin || isStudent || isFaculty || isWorker,
  });
}

export function useWorkers() {
  const { isAdmin } = useAuth();

  return useQuery({
    queryKey: ['workers'],
    queryFn: async () => {
      // Get all users with worker role
      const { data: workerRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'worker');

      if (rolesError) throw rolesError;

      const workerUserIds = workerRoles?.map(wr => wr.user_id) || [];

      if (workerUserIds.length === 0) return [];

      // Get profiles for workers
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', workerUserIds);

      if (profilesError) throw profilesError;

      return profiles as Profile[];
    },
    enabled: isAdmin,
  });
}

export function useIssue(id: string) {
  return useQuery({
    queryKey: ['issues', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('issues')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as Issue | null;
    },
    enabled: !!id,
  });
}

export function useCreateIssue() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: CreateIssueData) => {
      const { data: issue, error } = await supabase
        .from('issues')
        .insert({
          ...data,
          user_id: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return issue;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      toast.success('Issue reported successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateIssueData) => {
      const updateData: Record<string, unknown> = { ...data };
      
      if (data.status === 'resolved') {
        updateData.resolved_at = new Date().toISOString();
      }

      const { data: issue, error } = await supabase
        .from('issues')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return issue;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      toast.success('Issue updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useRateIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, rating }: { id: string; rating: number }) => {
      const { data: issue, error } = await supabase
        .from('issues')
        .update({ rating })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return issue;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      toast.success('Thank you for your feedback!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUploadImage() {
  return useMutation({
    mutationFn: async ({ file, userId }: { file: File; userId: string }) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('issue-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('issue-images')
        .getPublicUrl(fileName);

      return data.publicUrl;
    },
  });
}

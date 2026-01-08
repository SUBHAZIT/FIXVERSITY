-- Add RLS policies for workers to view and update their assigned issues
CREATE POLICY "Workers can view their assigned issues" 
ON public.issues 
FOR SELECT 
TO authenticated
USING (assigned_to = auth.uid());

CREATE POLICY "Workers can update their assigned issues" 
ON public.issues 
FOR UPDATE 
TO authenticated
USING (assigned_to = auth.uid())
WITH CHECK (assigned_to = auth.uid());

-- Allow workers to view profiles (for displaying submitter info)
CREATE POLICY "Workers can view profiles of issue submitters"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.issues 
    WHERE issues.assigned_to = auth.uid() 
    AND issues.user_id = profiles.user_id
  )
);

-- Convert any remaining 'user' roles to 'student'
UPDATE public.user_roles SET role = 'student' WHERE role = 'user';
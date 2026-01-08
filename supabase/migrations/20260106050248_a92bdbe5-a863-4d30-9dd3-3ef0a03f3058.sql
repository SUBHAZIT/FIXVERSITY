-- Allow students to view profiles of workers assigned to their issues
CREATE POLICY "Students can view profiles of assigned workers" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1
    FROM issues
    WHERE issues.user_id = auth.uid()
      AND issues.assigned_to = profiles.user_id
  )
);
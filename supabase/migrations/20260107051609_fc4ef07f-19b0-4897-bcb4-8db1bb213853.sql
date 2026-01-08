-- Add rating column to issues table (1-5 stars)
ALTER TABLE public.issues ADD COLUMN IF NOT EXISTS rating smallint CHECK (rating >= 1 AND rating <= 5);

-- Add RLS policy for users to rate their own resolved issues
CREATE POLICY "Users can rate their own resolved issues" 
ON public.issues 
FOR UPDATE 
USING ((auth.uid() = user_id) AND (status = 'resolved'::issue_status))
WITH CHECK ((auth.uid() = user_id) AND (status = 'resolved'::issue_status));
-- Add 'faculty' to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'faculty';

-- Add estimated_time column to issues table (in minutes)
ALTER TABLE public.issues ADD COLUMN IF NOT EXISTS estimated_time integer;

-- Update handle_new_user function to support faculty role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  selected_role app_role;
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'Fixversity User'),
    NEW.email
  );
  
  -- Get role from metadata, default to 'student' if not provided
  -- Only allow 'student', 'worker', or 'faculty' from signup (not admin)
  selected_role := CASE 
    WHEN NEW.raw_user_meta_data ->> 'role' = 'worker' THEN 'worker'::app_role
    WHEN NEW.raw_user_meta_data ->> 'role' = 'faculty' THEN 'faculty'::app_role
    ELSE 'student'::app_role
  END;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, selected_role);
  
  RETURN NEW;
END;
$function$;

-- Add RLS policy for faculty to view their own issues
CREATE POLICY "Faculty can view their own issues" 
ON public.issues 
FOR SELECT 
USING (auth.uid() = user_id);

-- Add RLS policy for faculty to create issues
CREATE POLICY "Faculty can create issues" 
ON public.issues 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add RLS policy for faculty to update their own open issues
CREATE POLICY "Faculty can update their own issues" 
ON public.issues 
FOR UPDATE 
USING ((auth.uid() = user_id) AND (status = 'open'::issue_status));
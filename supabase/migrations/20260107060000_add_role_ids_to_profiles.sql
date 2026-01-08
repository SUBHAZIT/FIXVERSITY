-- Add role-specific identifiers to profiles for Fixversity
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS student_code text,
ADD COLUMN IF NOT EXISTS faculty_id text,
ADD COLUMN IF NOT EXISTS worker_id text;


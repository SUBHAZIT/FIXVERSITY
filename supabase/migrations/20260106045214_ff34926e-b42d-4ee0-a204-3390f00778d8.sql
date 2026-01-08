-- Update handle_new_user function to use the role from signup metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
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
  -- Only allow 'student' or 'worker' from signup (not admin)
  selected_role := CASE 
    WHEN NEW.raw_user_meta_data ->> 'role' = 'worker' THEN 'worker'::app_role
    ELSE 'student'::app_role
  END;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, selected_role);
  
  RETURN NEW;
END;
$$;

-- Also update the default for role column from 'user' to 'student'
ALTER TABLE public.user_roles ALTER COLUMN role SET DEFAULT 'student'::app_role;
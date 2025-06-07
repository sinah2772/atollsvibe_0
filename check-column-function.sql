-- Function to check if a column exists in a table
-- This is used by the check-migration-status.js script

CREATE OR REPLACE FUNCTION check_column_exists(table_name text, column_name text)
RETURNS json AS $$
DECLARE
  column_exists boolean;
  result json;
BEGIN
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = check_column_exists.table_name 
      AND column_name = check_column_exists.column_name
  ) INTO column_exists;
  
  SELECT json_build_object('exists', column_exists) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER;

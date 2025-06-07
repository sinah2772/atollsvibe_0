-- SQL utility function to execute arbitrary SQL
-- This is needed because the JavaScript client can't directly execute arbitrary SQL

CREATE OR REPLACE FUNCTION run_sql(sql text)
RETURNS void AS $$
BEGIN
  EXECUTE sql;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER;

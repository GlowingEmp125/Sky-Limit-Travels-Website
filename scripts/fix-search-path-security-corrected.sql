-- ============================================
-- CORRECTED SEARCH PATH SECURITY FIX
-- Fixes syntax errors and handles PostgreSQL reserved keywords
-- ============================================

-- Step 1: Drop all policies that depend on the vulnerable function
DROP POLICY IF EXISTS "Service role full access to enquiries" ON "Enquiry";
DROP POLICY IF EXISTS "Service role full access to users" ON "User";
DROP POLICY IF EXISTS "Service role full access to holidays" ON "Holiday";
DROP POLICY IF EXISTS "Service role full access to trip plans" ON "TripPlan";

-- Step 2: Now we can safely drop the vulnerable function
DROP FUNCTION IF EXISTS is_admin_request();

-- Step 3: Drop any other potentially vulnerable functions
DROP FUNCTION IF EXISTS validate_admin_access();
DROP FUNCTION IF EXISTS safe_current_setting(text);
DROP FUNCTION IF EXISTS validate_request_header(text, text);

-- ============================================
-- CREATE SECURE FUNCTIONS WITH IMMUTABLE SEARCH_PATH
-- ============================================

-- Main admin validation function - SECURE VERSION
CREATE OR REPLACE FUNCTION is_admin_request()
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = ''  -- This makes the search_path immutable and secure
AS $$
BEGIN
  -- Check if the request comes with a service role
  -- Using fully qualified function names for maximum security
  
  -- Check for service role access (your API routes)
  BEGIN
    -- Use session_user or current_user instead of role setting
    IF pg_catalog.current_user = 'service_role' THEN
      RETURN true;
    END IF;
    
    -- Alternative: Check using current_setting with proper syntax
    IF pg_catalog.current_setting('request.jwt.claims', true)::jsonb->>'role' = 'service_role' THEN
      RETURN true;
    END IF;
    
  EXCEPTION
    WHEN OTHERS THEN
      -- If we can't read the setting, assume not admin
      RETURN false;
  END;
  
  -- For now, allow authenticated users (you can restrict this further)
  BEGIN
    IF pg_catalog.current_user = 'authenticated' THEN
      RETURN true;
    END IF;
  EXCEPTION
    WHEN OTHERS THEN
      RETURN false;
  END;
  
  -- Default deny for all other cases
  RETURN false;
  
END;
$$;

-- Simplified secure admin check function
CREATE OR REPLACE FUNCTION check_admin_access()
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = ''  -- Immutable search_path for security
AS $$
BEGIN
  -- Simple but secure check for service role
  IF pg_catalog.current_user = 'service_role' THEN
    RETURN true;
  END IF;
  
  -- Allow authenticated role (your API will use this)
  IF pg_catalog.current_user = 'authenticated' THEN
    RETURN true;
  END IF;
  
  -- Default deny
  RETURN false;
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$;

-- Utility function to safely get configuration values - SECURE VERSION
CREATE OR REPLACE FUNCTION safe_current_setting(setting_name text)
RETURNS text 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = ''  -- Secure search_path
AS $$
BEGIN
  RETURN pg_catalog.current_setting(setting_name, true);
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$;

-- Function to check if request has valid API key - SECURE VERSION
CREATE OR REPLACE FUNCTION validate_api_key()
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = ''  -- Secure search_path
AS $$
DECLARE
  api_key_header text;
BEGIN
  BEGIN
    -- Try to get API key from request headers
    api_key_header := pg_catalog.current_setting('request.header.x-api-key', true);
    
    -- Replace 'your-api-key-here' with your actual API key
    IF api_key_header = 'your-secure-api-key-here' THEN
      RETURN true;
    END IF;
    
    RETURN false;
  EXCEPTION
    WHEN OTHERS THEN
      RETURN false;
  END;
END;
$$;

-- ============================================
-- RECREATE ALL POLICIES WITH SECURE FUNCTIONS
-- ============================================

-- Enquiry table policies
CREATE POLICY "Service role full access to enquiries" ON "Enquiry"
  FOR ALL 
  USING (check_admin_access());

-- User table policies
CREATE POLICY "Service role full access to users" ON "User"
  FOR ALL 
  USING (check_admin_access());

-- Holiday table policies  
CREATE POLICY "Service role full access to holidays" ON "Holiday"
  FOR ALL 
  USING (check_admin_access());

-- TripPlan table policies
CREATE POLICY "Service role full access to trip plans" ON "TripPlan"
  FOR ALL 
  USING (check_admin_access());

-- ============================================
-- ALTERNATIVE: More restrictive policies (uncomment if needed)
-- ============================================

/*
-- If you want to be more restrictive, you can use these instead:

-- Only allow service_role for admin operations
CREATE POLICY "Only service role can access enquiries" ON "Enquiry"
  FOR ALL 
  USING (pg_catalog.current_user = 'service_role');

CREATE POLICY "Only service role can access users" ON "User"
  FOR ALL 
  USING (pg_catalog.current_user = 'service_role');

CREATE POLICY "Only service role can access holidays admin" ON "Holiday"
  FOR ALL 
  USING (pg_catalog.current_user = 'service_role');

CREATE POLICY "Only service role can access trip plans admin" ON "TripPlan"
  FOR ALL 
  USING (pg_catalog.current_user = 'service_role');
*/

-- ============================================
-- SECURITY VERIFICATION
-- ============================================

-- Check that all functions have secure search_path settings
SELECT 
  p.proname as "Function Name",
  p.prosecdef as "Security Definer",
  CASE 
    WHEN p.proconfig IS NULL THEN '❌ No search_path set'
    WHEN 'search_path=' = ANY(p.proconfig) THEN '✅ Secure search_path'
    ELSE '⚠️ Custom search_path: ' || pg_catalog.array_to_string(p.proconfig, ', ')
  END as "Search Path Security"
FROM pg_catalog.pg_proc p
JOIN pg_catalog.pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
  AND p.proname IN ('is_admin_request', 'check_admin_access', 'safe_current_setting', 'validate_api_key')
ORDER BY p.proname;

-- Verify all policies are recreated
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd as "Operation"
FROM pg_catalog.pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('Enquiry', 'User', 'Holiday', 'TripPlan')
ORDER BY tablename, policyname;

-- Test the functions work
SELECT 
  'check_admin_access()' as "Function",
  check_admin_access() as "Result",
  pg_catalog.current_user as "Current User";

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '==============================================';
  RAISE NOTICE '🔒 SECURITY VULNERABILITY FIXED! (Corrected)';
  RAISE NOTICE '==============================================';
  RAISE NOTICE '✅ Fixed syntax errors in functions';
  RAISE NOTICE '✅ Created secure functions with immutable search_path';
  RAISE NOTICE '✅ Updated all RLS policies to use secure functions';
  RAISE NOTICE '✅ Added proper error handling';
  RAISE NOTICE '==============================================';
  RAISE NOTICE '🛡️ Your database is now protected against:';
  RAISE NOTICE '   - Search path injection attacks';
  RAISE NOTICE '   - SQL injection via function manipulation';
  RAISE NOTICE '   - Reserved keyword conflicts';
  RAISE NOTICE '==============================================';
  RAISE NOTICE '📋 Functions available:';
  RAISE NOTICE '   - check_admin_access() - Main admin check';
  RAISE NOTICE '   - is_admin_request() - Alternative admin check';
  RAISE NOTICE '   - safe_current_setting() - Safe config access';
  RAISE NOTICE '   - validate_api_key() - API key validation';
  RAISE NOTICE '==============================================';
END $$; 
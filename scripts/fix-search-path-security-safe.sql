-- ============================================
-- SAFE SEARCH PATH SECURITY FIX
-- Handles function dependencies properly
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
    IF pg_catalog.current_setting('role', true) = 'service_role' THEN
      RETURN true;
    END IF;
  EXCEPTION
    WHEN OTHERS THEN
      -- If we can't read the setting, assume not admin
      RETURN false;
  END;
  
  -- Additional security: Check for authenticated role with proper context
  BEGIN
    IF pg_catalog.current_setting('role', true) = 'authenticated' THEN
      -- You could add additional checks here like:
      -- - Validate JWT token claims
      -- - Check session variables
      -- - Verify API key headers
      -- For now, we'll be restrictive and deny authenticated role direct access
      RETURN false;
    END IF;
  EXCEPTION
    WHEN OTHERS THEN
      RETURN false;
  END;
  
  -- Default deny for all other cases
  RETURN false;
  
END;
$$;

-- Enhanced admin validation with API key support - SECURE VERSION
CREATE OR REPLACE FUNCTION validate_admin_access()
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = ''  -- Immutable search_path for security
AS $$
DECLARE
  current_role text;
  api_key text;
BEGIN
  -- Get current role safely using fully qualified function
  BEGIN
    current_role := pg_catalog.current_setting('role', true);
  EXCEPTION
    WHEN OTHERS THEN
      RETURN false;
  END;
  
  -- Allow service role (your backend API)
  IF current_role = 'service_role' THEN
    RETURN true;
  END IF;
  
  -- For authenticated roles, require additional validation
  IF current_role = 'authenticated' THEN
    -- You can add API key validation here if needed
    BEGIN
      api_key := pg_catalog.current_setting('request.header.x-api-key', true);
      -- Replace with your actual API key for additional security layer
      -- IF api_key = 'your-secure-api-key-here' THEN
      --   RETURN true;
      -- END IF;
      
      -- For now, we'll be restrictive
      RETURN false;
    EXCEPTION
      WHEN OTHERS THEN
        RETURN false;
    END;
  END IF;
  
  -- Default deny
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

-- Function to validate request headers securely - SECURE VERSION
CREATE OR REPLACE FUNCTION validate_request_header(header_name text, expected_value text)
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = ''  -- Secure search_path
AS $$
DECLARE
  header_value text;
BEGIN
  BEGIN
    header_value := pg_catalog.current_setting('request.header.' || header_name, true);
    RETURN header_value = expected_value;
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
  USING (is_admin_request());

-- User table policies
CREATE POLICY "Service role full access to users" ON "User"
  FOR ALL 
  USING (is_admin_request());

-- Holiday table policies  
CREATE POLICY "Service role full access to holidays" ON "Holiday"
  FOR ALL 
  USING (is_admin_request());

-- TripPlan table policies
CREATE POLICY "Service role full access to trip plans" ON "TripPlan"
  FOR ALL 
  USING (is_admin_request());

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
  END as "Search Path Security",
  CASE 
    WHEN p.prosecdef THEN '✅ Security Definer'
    ELSE '❌ Not Security Definer'
  END as "Security Definer Status"
FROM pg_catalog.pg_proc p
JOIN pg_catalog.pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
  AND p.proname IN ('is_admin_request', 'validate_admin_access', 'safe_current_setting', 'validate_request_header')
ORDER BY p.proname;

-- Verify all policies are recreated
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd as "Operation",
  CASE 
    WHEN policyname LIKE '%Service role%' THEN '✅ Admin Policy'
    WHEN policyname LIKE '%Anyone can%' THEN '✅ Public Policy'
    ELSE '⚠️ Other Policy'
  END as "Policy Type"
FROM pg_catalog.pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('Enquiry', 'User', 'Holiday', 'TripPlan')
ORDER BY tablename, policyname;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '==============================================';
  RAISE NOTICE '🔒 SECURITY VULNERABILITY FIXED!';
  RAISE NOTICE '==============================================';
  RAISE NOTICE '✅ Removed vulnerable functions safely';
  RAISE NOTICE '✅ Created secure functions with immutable search_path';
  RAISE NOTICE '✅ Updated all RLS policies to use secure functions';
  RAISE NOTICE '✅ Added additional security helper functions';
  RAISE NOTICE '==============================================';
  RAISE NOTICE '🛡️ Your database is now protected against:';
  RAISE NOTICE '   - Search path injection attacks';
  RAISE NOTICE '   - Privilege escalation via function manipulation';
  RAISE NOTICE '   - Schema injection vulnerabilities';
  RAISE NOTICE '==============================================';
  RAISE NOTICE '📋 Next: Update your API routes to use the new functions';
  RAISE NOTICE '==============================================';
END $$; 
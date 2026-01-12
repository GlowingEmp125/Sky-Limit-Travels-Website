-- ============================================
-- FIX SEARCH PATH SECURITY VULNERABILITY
-- This script fixes the mutable search_path security issue
-- ============================================

-- Drop the existing vulnerable function
DROP FUNCTION IF EXISTS is_admin_request();

-- Create a secure version with immutable search_path
CREATE OR REPLACE FUNCTION is_admin_request()
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = ''  -- This makes the search_path immutable
AS $$
BEGIN
  -- Check if the request comes with a service role
  -- Using fully qualified function names for security
  
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
      -- For now, we'll be restrictive
      RETURN false;
    END IF;
  EXCEPTION
    WHEN OTHERS THEN
      RETURN false;
  END;
  
  -- Default deny
  RETURN false;
  
END;
$$;

-- ============================================
-- ALTERNATIVE: Even more secure function with API key validation
-- ============================================

-- Create a more secure version that validates API keys
CREATE OR REPLACE FUNCTION validate_admin_access()
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = ''  -- Immutable search_path
AS $$
DECLARE
  current_role text;
  api_key text;
BEGIN
  -- Get current role safely
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
  
  -- For other roles, require additional validation
  IF current_role = 'authenticated' THEN
    -- You can add API key validation here
    BEGIN
      api_key := pg_catalog.current_setting('request.header.x-api-key', true);
      -- Replace 'your-secure-api-key' with your actual API key
      IF api_key = 'your-secure-api-key-here' THEN
        RETURN true;
      END IF;
    EXCEPTION
      WHEN OTHERS THEN
        RETURN false;
    END;
  END IF;
  
  -- Default deny
  RETURN false;
  
END;
$$;

-- ============================================
-- UPDATE ALL POLICIES TO USE SECURE FUNCTION
-- ============================================

-- Drop existing policies that use the old function
DROP POLICY IF EXISTS "Service role full access to enquiries" ON "Enquiry";
DROP POLICY IF EXISTS "Service role full access to users" ON "User";
DROP POLICY IF EXISTS "Service role full access to holidays" ON "Holiday";
DROP POLICY IF EXISTS "Service role full access to trip plans" ON "TripPlan";

-- Recreate policies with the secure function
CREATE POLICY "Service role full access to enquiries" ON "Enquiry"
  FOR ALL 
  USING (is_admin_request());

CREATE POLICY "Service role full access to users" ON "User"
  FOR ALL 
  USING (is_admin_request());

CREATE POLICY "Service role full access to holidays" ON "Holiday"
  FOR ALL 
  USING (is_admin_request());

CREATE POLICY "Service role full access to trip plans" ON "TripPlan"
  FOR ALL 
  USING (is_admin_request());

-- ============================================
-- CREATE ADDITIONAL SECURITY FUNCTIONS
-- ============================================

-- Function to safely get configuration values
CREATE OR REPLACE FUNCTION safe_current_setting(setting_name text)
RETURNS text 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN pg_catalog.current_setting(setting_name, true);
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$;

-- Function to validate request headers securely
CREATE OR REPLACE FUNCTION validate_request_header(header_name text, expected_value text)
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = ''
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
-- VERIFY SECURITY FIXES
-- ============================================

-- Check that functions have proper security settings
SELECT 
  p.proname as "Function Name",
  p.prosecdef as "Security Definer",
  CASE 
    WHEN p.proconfig IS NULL THEN '❌ No search_path set'
    WHEN 'search_path=' = ANY(p.proconfig) THEN '✅ Secure search_path'
    ELSE '⚠️ Custom search_path: ' || array_to_string(p.proconfig, ', ')
  END as "Search Path Security"
FROM pg_catalog.pg_proc p
JOIN pg_catalog.pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
  AND p.proname IN ('is_admin_request', 'validate_admin_access', 'safe_current_setting', 'validate_request_header');

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'SECURITY FIXES APPLIED!';
  RAISE NOTICE '==============================================';
  RAISE NOTICE '✅ Fixed search_path vulnerability';
  RAISE NOTICE '✅ Updated admin validation function';
  RAISE NOTICE '✅ Added additional security helpers';
  RAISE NOTICE '✅ All policies updated with secure functions';
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'Your database is now more secure!';
  RAISE NOTICE '==============================================';
END $$; 
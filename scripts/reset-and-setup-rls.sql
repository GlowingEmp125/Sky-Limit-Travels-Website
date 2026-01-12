-- ============================================
-- RESET AND SETUP RLS - Handles Existing Policies
-- This script safely removes existing policies and recreates them
-- ============================================

-- First, disable RLS temporarily to clean up
ALTER TABLE "Enquiry" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Holiday" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "TripPlan" DISABLE ROW LEVEL SECURITY;

-- ============================================
-- DROP ALL EXISTING POLICIES
-- ============================================

-- Drop Enquiry policies
DROP POLICY IF EXISTS "Anyone can submit enquiries" ON "Enquiry";
DROP POLICY IF EXISTS "Allow public enquiry submission" ON "Enquiry";
DROP POLICY IF EXISTS "Admin can view all enquiries" ON "Enquiry";
DROP POLICY IF EXISTS "Admin can update enquiries" ON "Enquiry";
DROP POLICY IF EXISTS "Admin can delete enquiries" ON "Enquiry";
DROP POLICY IF EXISTS "Service role full access to enquiries" ON "Enquiry";

-- Drop User policies
DROP POLICY IF EXISTS "Admin can view users" ON "User";
DROP POLICY IF EXISTS "Admin can create users" ON "User";
DROP POLICY IF EXISTS "Admin can update users" ON "User";
DROP POLICY IF EXISTS "Admin can delete users" ON "User";
DROP POLICY IF EXISTS "Service role full access to users" ON "User";

-- Drop Holiday policies
DROP POLICY IF EXISTS "Public can view available holidays" ON "Holiday";
DROP POLICY IF EXISTS "Anyone can view available holidays" ON "Holiday";
DROP POLICY IF EXISTS "Admin can view all holidays" ON "Holiday";
DROP POLICY IF EXISTS "Admin can create holidays" ON "Holiday";
DROP POLICY IF EXISTS "Admin can update holidays" ON "Holiday";
DROP POLICY IF EXISTS "Admin can delete holidays" ON "Holiday";
DROP POLICY IF EXISTS "Service role full access to holidays" ON "Holiday";

-- Drop TripPlan policies
DROP POLICY IF EXISTS "Public can create trip plans" ON "TripPlan";
DROP POLICY IF EXISTS "Anyone can create trip plans" ON "TripPlan";
DROP POLICY IF EXISTS "Admin can view all trip plans" ON "TripPlan";
DROP POLICY IF EXISTS "Admin can update trip plans" ON "TripPlan";
DROP POLICY IF EXISTS "Admin can delete trip plans" ON "TripPlan";
DROP POLICY IF EXISTS "Service role full access to trip plans" ON "TripPlan";

-- ============================================
-- DROP EXISTING FUNCTIONS
-- ============================================

DROP FUNCTION IF EXISTS is_admin_user();
DROP FUNCTION IF EXISTS is_admin_request();
DROP FUNCTION IF EXISTS validate_api_key();

-- ============================================
-- RE-ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE "Enquiry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Holiday" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TripPlan" ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE ADMIN VALIDATION FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION is_admin_request()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if the request comes with a service role key
  -- This allows your NextJS API routes to bypass RLS when needed
  
  -- For now, allowing service role access (your API routes)
  IF current_setting('role', true) = 'service_role' THEN
    RETURN TRUE;
  END IF;
  
  -- For direct database access, we'll be more restrictive
  -- You can implement additional checks here based on your needs
  RETURN FALSE;
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ENQUIRY TABLE POLICIES
-- ============================================

-- Allow anyone to insert enquiries (public contact forms)
CREATE POLICY "Anyone can submit enquiries" ON "Enquiry"
  FOR INSERT 
  WITH CHECK (true);

-- Allow service role (your API) to do everything with enquiries
CREATE POLICY "Service role full access to enquiries" ON "Enquiry"
  FOR ALL 
  USING (is_admin_request());

-- ============================================
-- USER TABLE POLICIES  
-- ============================================

-- Only service role can access users table
CREATE POLICY "Service role full access to users" ON "User"
  FOR ALL 
  USING (is_admin_request());

-- ============================================
-- HOLIDAY TABLE POLICIES
-- ============================================

-- Allow anyone to read available holidays
CREATE POLICY "Anyone can view available holidays" ON "Holiday"
  FOR SELECT 
  USING (available = true);

-- Allow service role to do everything with holidays
CREATE POLICY "Service role full access to holidays" ON "Holiday"
  FOR ALL 
  USING (is_admin_request());

-- ============================================
-- TRIP PLAN TABLE POLICIES
-- ============================================

-- Allow anyone to create trip plans (public forms)
CREATE POLICY "Anyone can create trip plans" ON "TripPlan"
  FOR INSERT 
  WITH CHECK (true);

-- Allow service role to do everything with trip plans
CREATE POLICY "Service role full access to trip plans" ON "TripPlan"
  FOR ALL 
  USING (is_admin_request());

-- ============================================
-- GRANT PERMISSIONS FOR PUBLIC ACCESS
-- ============================================

-- Revoke all permissions first to clean slate
REVOKE ALL ON "Enquiry" FROM anon;
REVOKE ALL ON "User" FROM anon;
REVOKE ALL ON "Holiday" FROM anon;
REVOKE ALL ON "TripPlan" FROM anon;

-- Grant specific permissions for anon users (public access)
GRANT INSERT ON "Enquiry" TO anon;
GRANT INSERT ON "TripPlan" TO anon;
GRANT SELECT ON "Holiday" TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Ensure authenticated role has necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================
-- VERIFICATION
-- ============================================

-- Check RLS status
SELECT 
  tablename, 
  rowsecurity as "RLS Enabled",
  CASE 
    WHEN rowsecurity THEN '✅ Enabled'
    ELSE '❌ Disabled'
  END as "Status"
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('Enquiry', 'User', 'Holiday', 'TripPlan')
ORDER BY tablename;

-- List all policies
SELECT 
  tablename,
  policyname,
  cmd as "Operation",
  roles as "Roles"
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'RLS Setup Complete!';
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'Tables secured: Enquiry, User, Holiday, TripPlan';
  RAISE NOTICE 'Public access: Contact forms and trip plans';
  RAISE NOTICE 'Admin access: All operations via service role';
  RAISE NOTICE '==============================================';
END $$; 
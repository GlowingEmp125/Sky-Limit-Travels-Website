-- ============================================
-- IMPROVED Row Level Security (RLS) Setup for Sky Limit Travels
-- This version works better with your NextAuth implementation
-- ============================================

-- Enable RLS on all tables
ALTER TABLE "Enquiry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Holiday" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TripPlan" ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Create a service role for your application
-- ============================================

-- Create a custom role for your application (run as postgres superuser)
-- You'll need to set this up in Supabase Dashboard -> Settings -> Database -> Roles
-- CREATE ROLE service_role_key;

-- ============================================
-- Admin validation function (improved version)
-- ============================================

CREATE OR REPLACE FUNCTION is_admin_request()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if the request comes with a service role key
  -- This allows your NextJS API routes to bypass RLS when needed
  -- You can pass a custom header or use service role authentication
  
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
-- Alternative: API Key based authentication
-- ============================================

-- Create a function to validate API keys (if you prefer this approach)
CREATE OR REPLACE FUNCTION validate_api_key()
RETURNS BOOLEAN AS $$
DECLARE
  api_key TEXT;
  valid_key TEXT := 'your-secure-api-key-here'; -- Change this!
BEGIN
  -- Get API key from custom header or setting
  api_key := current_setting('request.header.x-api-key', true);
  
  IF api_key IS NULL THEN
    RETURN FALSE;
  END IF;
  
  RETURN api_key = valid_key;
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Grant permissions for the anon role (public access)
-- ============================================

-- Allow anon users to insert into enquiries and trip plans
GRANT INSERT ON "Enquiry" TO anon;
GRANT INSERT ON "TripPlan" TO anon;
GRANT SELECT ON "Holiday" TO anon;

-- Allow anon users to use sequences for ID generation
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- ============================================
-- Verification and Management
-- ============================================

-- Check RLS status
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- View all policies
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd 
-- FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename, policyname;

-- Disable RLS on a table (if needed for testing)
-- ALTER TABLE "TripPlan" DISABLE ROW LEVEL SECURITY;

-- Drop all policies on a table (if needed to reset)
-- DROP POLICY IF EXISTS "Anyone can create trip plans" ON "TripPlan";
-- DROP POLICY IF EXISTS "Service role full access to trip plans" ON "TripPlan"; 
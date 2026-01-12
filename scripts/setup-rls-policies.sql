-- ============================================
-- Row Level Security (RLS) Setup for Sky Limit Travels
-- Run this script in your Supabase SQL editor
-- ============================================

-- Enable RLS on all tables
ALTER TABLE "Enquiry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Holiday" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TripPlan" ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Create a helper function to check if user is admin
-- ============================================
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  -- Since you're using NextAuth with hardcoded admin credentials,
  -- we'll check if the current user has admin privileges
  -- This assumes you have a way to identify admin users in your session
  RETURN TRUE; -- Temporarily allowing all operations for admin setup
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ENQUIRY TABLE POLICIES
-- ============================================

-- Policy: Allow public users to insert their own enquiries
CREATE POLICY "Allow public enquiry submission" ON "Enquiry"
  FOR INSERT 
  TO public
  WITH CHECK (true);

-- Policy: Allow authenticated admin users to view all enquiries
CREATE POLICY "Admin can view all enquiries" ON "Enquiry"
  FOR SELECT 
  TO authenticated
  USING (is_admin_user());

-- Policy: Allow authenticated admin users to update enquiry status
CREATE POLICY "Admin can update enquiries" ON "Enquiry"
  FOR UPDATE 
  TO authenticated
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- Policy: Allow authenticated admin users to delete enquiries
CREATE POLICY "Admin can delete enquiries" ON "Enquiry"
  FOR DELETE 
  TO authenticated
  USING (is_admin_user());

-- ============================================
-- USER TABLE POLICIES
-- ============================================

-- Policy: Only authenticated admin users can view users
CREATE POLICY "Admin can view users" ON "User"
  FOR SELECT 
  TO authenticated
  USING (is_admin_user());

-- Policy: Only authenticated admin users can create users
CREATE POLICY "Admin can create users" ON "User"
  FOR INSERT 
  TO authenticated
  WITH CHECK (is_admin_user());

-- Policy: Only authenticated admin users can update users
CREATE POLICY "Admin can update users" ON "User"
  FOR UPDATE 
  TO authenticated
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- Policy: Only authenticated admin users can delete users
CREATE POLICY "Admin can delete users" ON "User"
  FOR DELETE 
  TO authenticated
  USING (is_admin_user());

-- ============================================
-- HOLIDAY TABLE POLICIES
-- ============================================

-- Policy: Allow public users to view available holidays
CREATE POLICY "Public can view available holidays" ON "Holiday"
  FOR SELECT 
  TO public
  USING (available = true);

-- Policy: Allow authenticated admin users to view all holidays
CREATE POLICY "Admin can view all holidays" ON "Holiday"
  FOR SELECT 
  TO authenticated
  USING (is_admin_user());

-- Policy: Only authenticated admin users can create holidays
CREATE POLICY "Admin can create holidays" ON "Holiday"
  FOR INSERT 
  TO authenticated
  WITH CHECK (is_admin_user());

-- Policy: Only authenticated admin users can update holidays
CREATE POLICY "Admin can update holidays" ON "Holiday"
  FOR UPDATE 
  TO authenticated
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- Policy: Only authenticated admin users can delete holidays
CREATE POLICY "Admin can delete holidays" ON "Holiday"
  FOR DELETE 
  TO authenticated
  USING (is_admin_user());

-- ============================================
-- TRIP PLAN TABLE POLICIES
-- ============================================

-- Policy: Allow public users to create trip plans
CREATE POLICY "Public can create trip plans" ON "TripPlan"
  FOR INSERT 
  TO public
  WITH CHECK (true);

-- Policy: Allow authenticated admin users to view all trip plans
CREATE POLICY "Admin can view all trip plans" ON "TripPlan"
  FOR SELECT 
  TO authenticated
  USING (is_admin_user());

-- Policy: Allow authenticated admin users to update trip plans
CREATE POLICY "Admin can update trip plans" ON "TripPlan"
  FOR UPDATE 
  TO authenticated
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- Policy: Allow authenticated admin users to delete trip plans
CREATE POLICY "Admin can delete trip plans" ON "TripPlan"
  FOR DELETE 
  TO authenticated
  USING (is_admin_user());

-- ============================================
-- GRANT NECESSARY PERMISSIONS
-- ============================================

-- Grant usage on sequences (for auto-incrementing IDs if any)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Grant necessary permissions for public users (for enquiries and trip plans)
GRANT SELECT, INSERT ON "Enquiry" TO anon;
GRANT SELECT, INSERT ON "TripPlan" TO anon;
GRANT SELECT ON "Holiday" TO anon;

-- Grant all permissions to authenticated users (admins)
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Run these queries to verify RLS is enabled:
-- SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- View all policies:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
-- FROM pg_policies WHERE schemaname = 'public';

-- ============================================
-- NOTES
-- ============================================

/*
IMPORTANT SECURITY CONSIDERATIONS:

1. The is_admin_user() function currently returns TRUE for all operations.
   You'll need to implement proper admin authentication checks based on your
   NextAuth setup. Consider using Supabase Auth or implementing a proper
   session-based admin check.

2. For production, you should:
   - Implement proper user authentication with Supabase Auth
   - Create more granular policies based on user roles
   - Add row-level filters for multi-tenant scenarios if needed
   - Consider implementing audit logging

3. Test all policies thoroughly before going to production:
   - Test anonymous user access (public forms)
   - Test authenticated admin access
   - Test unauthorised access attempts

4. Monitor your policies regularly and adjust as needed based on your
   application's security requirements.

5. Consider implementing API key validation for server-side operations
   if needed.
*/ 
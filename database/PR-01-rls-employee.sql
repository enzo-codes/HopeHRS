-- PR-01: RLS Policy for Employee Table
DROP POLICY IF EXISTS "Allow All Employee" ON employee;
CREATE POLICY "Allow All Employee" ON employee FOR ALL USING (true);

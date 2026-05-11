-- PR-02: RLS Policies for Job, JobHistory, and Department
DROP POLICY IF EXISTS "Allow All Dept" ON department;
CREATE POLICY "Allow All Dept" ON department FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow All Job" ON job;
CREATE POLICY "Allow All Job" ON job FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow All JobHistory" ON jobhistory;
CREATE POLICY "Allow All JobHistory" ON jobhistory FOR ALL USING (true);

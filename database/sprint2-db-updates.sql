-- PR-01 & PR-02: RLS Policies
DROP POLICY IF EXISTS "Allow All Employee" ON employee;
CREATE POLICY "Allow All Employee" ON employee FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow All Dept" ON department;
CREATE POLICY "Allow All Dept" ON department FOR ALL USING (true);

-- PR-03: Cascade Trigger for Status Sync
CREATE OR REPLACE FUNCTION sync_job_history_status()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE job_history SET status = NEW.status WHERE empno = NEW.empno;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_sync_status
AFTER UPDATE OF status ON employee
FOR EACH ROW EXECUTE FUNCTION sync_job_history_status();

-- PR-04: Employee Current Job View
CREATE OR REPLACE VIEW employee_current_job AS
SELECT e.empno, e.firstname, e.lastname, d.deptname
FROM employee e
LEFT JOIN department d ON e.deptno = d.deptcode;

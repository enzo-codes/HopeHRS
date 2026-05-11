-- PR-03: Cascade Trigger for Status Sync
-- Automatically updates jobhistory status when employee status changes

CREATE OR REPLACE FUNCTION sync_job_history_status()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE jobhistory SET status = NEW.status WHERE empno = NEW.empno;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_sync_status
AFTER UPDATE OF status ON employee
FOR EACH ROW EXECUTE FUNCTION sync_job_history_status();

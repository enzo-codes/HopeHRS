-- Verification of Row Counts for Sprint 1
SELECT 'employee' as table_name, COUNT(*) as actual_count FROM employee
UNION ALL
SELECT 'department', COUNT(*) FROM department
UNION ALL
SELECT 'job', COUNT(*) FROM job
UNION ALL
SELECT 'jobHistory', COUNT(*) FROM jobHistory;

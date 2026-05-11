-- PR-04: Employee Current Job View
-- Simplifies fetching employee names with their corresponding department names

CREATE OR REPLACE VIEW employee_current_job AS
SELECT e.empno, e.firstname, e.lastname, d.deptname
FROM employee e
LEFT JOIN department d ON e.deptno = d.deptcode;

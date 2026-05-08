CREATE TABLE department (
    deptid VARCHAR(5) PRIMARY KEY,
    deptname VARCHAR(50),
    record_status VARCHAR(10) DEFAULT 'ACTIVE',
    stamp TEXT DEFAULT 'Initial seeding'
);

CREATE TABLE job (
    jobid VARCHAR(5) PRIMARY KEY,
    jobtitle VARCHAR(50),
    minsal NUMERIC,
    maxsal NUMERIC,
    record_status VARCHAR(10) DEFAULT 'ACTIVE',
    stamp TEXT DEFAULT 'Initial seeding'
);

CREATE TABLE employee (
    empno VARCHAR(5) PRIMARY KEY,
    lastname VARCHAR(15),
    firstname VARCHAR(15),
    gender CHAR(1) CHECK (gender IN ('M','F')),
    birthdate DATE,
    hiredate DATE,
    sepdate DATE,
    deptid VARCHAR(5) REFERENCES department(deptid),
    jobid VARCHAR(5) REFERENCES job(jobid),
    record_status VARCHAR(10) DEFAULT 'ACTIVE',
    stamp TEXT DEFAULT 'Initial seeding'
);

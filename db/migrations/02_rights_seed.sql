-- Create Tables with user_type column
CREATE TABLE "user" (
    id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
    email text,
    user_type text DEFAULT 'USER',
    record_status text DEFAULT 'INACTIVE'
);

CREATE TABLE "Module" (
    mod_id serial PRIMARY KEY,
    mod_name text
);

CREATE TABLE "rights" (
    right_id serial PRIMARY KEY,
    right_name text
);

CREATE TABLE "user_module" (
    um_id serial PRIMARY KEY,
    user_id uuid REFERENCES "user"(id),
    mod_id int REFERENCES "Module"(mod_id)
);

CREATE TABLE "UserModule_Rights" (
    umr_id serial PRIMARY KEY,
    um_id int REFERENCES "user_module"(um_id),
    right_id int REFERENCES "rights"(right_id),
    has_right int DEFAULT 0
);

-- Seed Modules (5 modules)
INSERT INTO "Module" (mod_name) VALUES
    ('Emp_Mod'),
    ('JH_Mod'),
    ('Job_Mod'),
    ('Dept_Mod'),
    ('Adm_Mod');

-- Seed Rights (17 rights)
INSERT INTO "rights" (right_name) VALUES
    ('EMP_VIEW'),
    ('EMP_ADD'),
    ('EMP_EDIT'),
    ('EMP_DEL'),
    ('JH_VIEW'),
    ('JH_ADD'),
    ('JH_EDIT'),
    ('JH_DEL'),
    ('JOB_VIEW'),
    ('JOB_ADD'),
    ('JOB_EDIT'),
    ('JOB_DEL'),
    ('DEPT_VIEW'),
    ('DEPT_ADD'),
    ('DEPT_EDIT'),
    ('DEPT_DEL'),
    ('ADM_USER')
ON CONFLICT DO NOTHING;

-- SUPERADMIN seed for jcesperanza@neu.edu.ph
-- IMPORTANT: Replace 'UUID-HERE' with the actual UUID from auth.users
-- Run this query first to get the UUID:
-- SELECT id FROM auth.users WHERE email = 'jcesperanza@neu.edu.ph';
INSERT INTO "user" (id, email, user_type, record_status)
VALUES ('UUID-HERE', 'jcesperanza@neu.edu.ph', 'SUPERADMIN', 'ACTIVE');

-- Then grant all module access and all rights for SUPERADMIN
-- (Replace UUID-HERE again with the same UUID)
DO $$
DECLARE
    super_uuid uuid := 'UUID-HERE';
    mod_rec RECORD;
    um_id_var integer;
BEGIN
    FOR mod_rec IN SELECT mod_id FROM "Module" LOOP
        INSERT INTO user_module (user_id, mod_id)
        VALUES (super_uuid, mod_rec.mod_id)
        RETURNING um_id INTO um_id_var;

        INSERT INTO UserModule_Rights (um_id, right_id, has_right)
        SELECT um_id_var, right_id, 1 FROM "rights";
    END LOOP;
END $$;
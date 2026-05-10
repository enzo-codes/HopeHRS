-- Create Tables
CREATE TABLE "user" (id uuid REFERENCES auth.users NOT NULL PRIMARY KEY, email text, record_status text DEFAULT 'ACTIVE');
CREATE TABLE "Module" (mod_id serial PRIMARY KEY, mod_name text);
CREATE TABLE "rights" (right_id serial PRIMARY KEY, right_name text);
CREATE TABLE "user_module" (um_id serial PRIMARY KEY, user_id uuid REFERENCES "user"(id), mod_id int REFERENCES "Module"(mod_id));
CREATE TABLE "UserModule_Rights" (umr_id serial PRIMARY KEY, um_id int REFERENCES "user_module"(um_id), right_id int REFERENCES "rights"(right_id), has_right int DEFAULT 0);

-- Seed Modules (5 modules)
INSERT INTO "Module" (mod_name) VALUES ('Emp_Mod'), ('JH_Mod'), ('Job_Mod'), ('Dept_Mod'), ('Adm_Mod');

-- Seed Rights (17 rights placeholder)
-- Note: Add all 17 specific rights here based on your project requirements

-- SUPERADMIN seed for jcesperanza@neu.edu.ph
-- Note: Replace 'UUID-HERE' with the actual user ID from Supabase
INSERT INTO "user" (id, email, record_status) VALUES ('UUID-HERE', 'jcesperanza@neu.edu.ph', 'ACTIVE');

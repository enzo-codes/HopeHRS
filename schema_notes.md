# Database Schema Notes - Sprint 1
**Role:** M3 - Database Engineer

## 1. Core HR Tables
Ang mga sumusunod na tables ay kinuha mula sa HopeDB at in-initialize para sa Human Resource System:
* **employee**: Naglalaman ng 31 records ng mga empleyado.
* **department**: Listahan ng 8 departments sa kumpanya.
* **job**: Listahan ng 14 na positions o job titles.
* **jobHistory**: Naglalaman ng 54 records na nagpapakita ng career movement ng mga empleyado.

## 2. Security and Auditing Columns
Lahat ng core HR tables ay nilagyan ng mga mandatory columns para sa tracking at soft-delete functionality:
* **record_status**: Nakaset sa `'ACTIVE'` bilang default value. Ginagamit ito para sa soft-delete system.
* **stamp**: Ginagamit para sa auditing (date/time tracking ng records).

## 3. Rights and Authentication System
Bilang paghahanda sa Rights Enforcement, ginawa at ni-seed ang mga sumusunod na tables:
* **user**: Para sa profile ng mga system users.
* **Module**: Naglalaman ng 5 seeded modules (Emp_Mod, JH_Mod, Job_Mod, Dept_Mod, Adm_Mod).
* **rights**: Naglalaman ng 17 specific rights para sa system access.
* **user_module** at **UserModule_Rights**: Junction tables para sa mapping ng permissions.

## 4. Initial Seeds
* **SUPERADMIN Account**: Naka-provision na ang email na `jcesperanza@neu.edu.ph` na may access sa lahat ng 17 rights (value = 1).
* **New user provisioning trigger**: A Supabase auth trigger inserts a new row into the application `user` table with `record_status = 'INACTIVE'`, then creates module/rights mappings with `has_right = 0` for all rights.

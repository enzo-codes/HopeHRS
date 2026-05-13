-- Drop existing trigger and function (if any)
DROP TRIGGER IF EXISTS trigger_provision_new_user ON auth.users;
DROP FUNCTION IF EXISTS provision_new_user();

-- Trigger to provision a new authenticated user into the application rights system.
-- New users are inserted as INACTIVE, USER type, and are assigned default module-right mappings.
CREATE OR REPLACE FUNCTION provision_new_user()
RETURNS trigger AS $$
DECLARE
  new_um_id INTEGER;
  module_row RECORD;
BEGIN
  -- Insert the new application user record with INACTIVE status and USER type
  INSERT INTO "user" (id, email, record_status, user_type)
  VALUES (NEW.id, NEW.email, 'INACTIVE', 'USER');

  -- For each module, create the junction row and assign view-only rights by default.
  FOR module_row IN SELECT mod_id FROM "Module" LOOP
    INSERT INTO user_module (user_id, mod_id)
    VALUES (NEW.id, module_row.mod_id)
    RETURNING um_id INTO new_um_id;

    INSERT INTO "UserModule_Rights" (um_id, right_id, has_right)
    SELECT
      new_um_id,
      right_id,
      CASE
        WHEN lower(right_name) LIKE '%view%' THEN 1
        ELSE 0
      END
    FROM "rights";
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to auth.users table
CREATE TRIGGER trigger_provision_new_user
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION provision_new_user();
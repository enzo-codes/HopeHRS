-- Trigger to provision a new authenticated user into the application rights system.
-- New users are inserted into the application user table as INACTIVE and are assigned default module-right mappings.

CREATE OR REPLACE FUNCTION provision_new_user()
RETURNS trigger AS $$
DECLARE
  new_um_id INTEGER;
  module_row RECORD;
BEGIN
  -- Insert the new application user record with INACTIVE status
  INSERT INTO "user" (id, email, record_status)
  VALUES (NEW.id, NEW.email, 'INACTIVE');

  -- For each module, create the junction row and assign all rights with has_right = 0.
  FOR module_row IN SELECT mod_id FROM "Module" LOOP
    INSERT INTO user_module (user_id, mod_id)
    VALUES (NEW.id, module_row.mod_id)
    RETURNING um_id INTO new_um_id;

    INSERT INTO "UserModule_Rights" (um_id, right_id, has_right)
    SELECT new_um_id, right_id, 0
    FROM "rights";
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_provision_new_user
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION provision_new_user();

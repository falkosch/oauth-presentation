# oauth-presentation

## How to run

1. Create file `.env` in the repository root:

   ```ini
   KC_BOOTSTRAP_ADMIN_PASSWORD=1337
   KC_DB_PASSWORD=1337
   PGADMIN_DEFAULT_PASSWORD=1337
   ```

2. Run `docker compose up -d`.
3. Open the [KeyCloak Admin Console](http://localhost:8080/admin) and login as user `kcadmin` using the password in `KC_BOOTSTRAP_ADMIN_PASSWORD` you set in your `.env` file.
4. Initial data for realm [customer](http://localhost:8080/admin/master/console/#/customer) is imported by KeyCloak on container start.
5. Users still need to be [created manually](https://www.keycloak.org/getting-started/getting-started-docker#_create_a_user). In [customer -> Users](http://localhost:8080/admin/master/console/#/customer/users), create a user for your first The Online Bank customer as follows:
   - Credentials -> `Set password`
     - Temporary: `Off`
   - In addition to `username`, set a `First name` and `Last name`.
6. Run `npm start` in `./the-online-bank`.
7. Open [The Online Bank](http://localhost:4200/) in your browser.

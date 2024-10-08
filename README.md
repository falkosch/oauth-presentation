# oauth-presentation

## How to run

1. Create file `.env` in the repository root:

    ```ini
    KC_BOOTSTRAP_ADMIN_USERNAME=root
    KC_BOOTSTRAP_ADMIN_PASSWORD=1337
    ```

2. Run `docker compose up -d`
3. Open `http://localhost:8080/admin`
4. Follow the [Getting started guide](https://www.keycloak.org/getting-started/getting-started-docker)
    1. Create a realm `customer`
    2. In this realm, create client `the-online-bank`
    3. Setup client `the-online-bank` as follows:
        * Valid redirect URIs: `http://localhost:4200/*`
        * Web origins: `*`
        * (Optional) Consent required: `On`
    4. Create a user and setup as follows:
        * Credentials -> `Set password`
            * Temporary: `Off`
        * In addition to `username`, set a `First name` and `Last name`.
5. Run `npm start` in `./the-online-bank`
6. Open `http://localhost:4200/`

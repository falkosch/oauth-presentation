# oauth-presentation

## How to run

1. Create file `.env` in the repository root:

    ```ini
    KEYCLOAK_ADMIN=root
    KEYCLOAK_ADMIN_PASSWORD=1337
    ```

2. Run `docker compose up -d`
3. Open `http://localhost:8080/admin`
4. Follow the [Getting started guide](https://www.keycloak.org/getting-started/getting-started-docker) to configure Realm `customer`, Client `the-online-banking`, and any users
5. Run `npm start` in `./the-online-bank`
6. Open `http://localhost:4200/`

# 不揪 Food Date

_不揪 Food Date_ is a powerful restaurant gathering app.

## For development only

### Warnings

- Please do not refresh or reload the website unless necessary. Each refresh uses a quota.
- Please DO NOT commit any API keys to the repository. If you need to use an API key,
  put it in `.env` and do not commit it (`.env` is included in `.gitignore`).

### Running the app

1. Install dependencies

   ```bash
   yarn install
   ```

2. Create a copy of `.env.example` as `.env.local` and replace `"YOUR-API-KEY-HERE"` with your Google API key and `"YOUR-MAP-ID-HERE"` with your Map ID.

3. Run migrations

   ```bash
   yarn migrate
   ```

4. Start the development server

   ```bash
   yarn dev
   ```

5. Open http://localhost:3000 in your browser

### Resources

react-google-maps Docs: [https://visgl.github.io/react-google-maps/](https://visgl.github.io/react-google-maps/)
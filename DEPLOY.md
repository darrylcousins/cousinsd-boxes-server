## Deployment

# Create a transferrable development store

Not possible without shopify approval. So i've installed instead on non-transferable store.

1. Create public app on partners shopify
2. Use url https://APP.herokuapp.com and /auth/callback
3. Collect SHOPIFY_API_KEY and SHOPIFY_SECRET_API_KEY

# Create a Heroku account

1. Create app
2. Resources -> add postgres
3. Settings -> nodejs buildpack and config vars: SHOPIFY_API_KEY, SHOPIFY_SECRET_API_KEY, HOST, API_VERSION, SHOP_NAME
4. Migrate empty database:

```bash
# heroku pg:reset --confirm {APP} DATABASE_URL
PGUSER=cousinsd PGPASSWORD=******** heroku pg:push shopify_boxes DATABASE_URL -a {APP}
```

# Postgres

Access to database on command line:

```bash
heroku pg:psql -a {APP}
```

# Download the store theme

Requires themekit. Go to store apps, add private app. Select theme read/write
permissions. Gather the secret authentication details.

```bash
mkdir theme; cd theme;
theme get --list -p=[your-password] -s=[you-store.myshopify.com]
```

Then download the 'live' theme to local folder
```bash
theme get -p=[your-password] -s=[you-store.myshopify.com] -t=[your-theme-id]
```

# Build client component

Make our branch, build, copy to theme, and deploy from there.

```bash
https://github.com/darrylcousins/shopify-boxes-client.git
git checkout -b {APP}
vi src/config.js # fix host url
git push origin {APP}
npm install
npm run component
cp dist/boxes.bundle.js ../theme/assets
cd ../theme
theme deploy assets/boxes.bundle.js
```

Edit cart template and others. TODO.

# Build server

Don't need a branch for this one because it has the environment variables.

```bash
https://github.com/darrylcousins/shopify-boxes-server.git
heroku git:remote -a APP
git push heroku main
```

* Set up container boxes on development store (box-container-products.csv)
* Set up produce on development store (box-produce-products.csv)
* Verify that webhooks added products to Heroku database

How to get this in from the developement?
```json
"@cousinsd/shopify-boxes-client": "file:../shopify-boxes-client"
```

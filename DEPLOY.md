## Deployment

# Create a shopify store

That's a job for the client who may already have a store.

# Create a Heroku account

1. Create app
2. Resources -> add postgres
3. Settings -> nodejs buildpack and config vars: HOST (https://{APP}/herokuapp.com)
4. Migrate empty database:

```bash
# heroku pg:reset --confirm {APP} DATABASE_URL
PGUSER=cousinsd PGPASSWORD=******** heroku pg:push shopify_boxes DATABASE_URL -a {APP}
```

# Build server

Don't need a branch for this one because it has the environment variables.

```bash
git clone https://github.com/darrylcousins/shopify-boxes-server.git
cd shopify-boxes-server
heroku git:remote -a {APP}
git push heroku main
```

# Create an app

Done through the shopify partners account.

1. Create public app on partners shopify
2. Use url https://APP.herokuapp.com and /auth/callback
3. Collect SHOPIFY_API_KEY and SHOPIFY_SECRET_API_KEY
3. Back to heroku dyno config vars: SHOPIFY_API_KEY, SHOPIFY_SECRET_API_KEY, API_VERSION, SHOP_NAME

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
#Finally

* Set up container boxes on development store (box-container-products.csv)
* Set up produce on development store (box-produce-products.csv)
* Verify that webhooks added products to Heroku database

Edit cart template and others. TODO.

# Concerns

How to get this in from the development?
```json
"@cousinsd/shopify-boxes-client": "file:../shopify-boxes-client"
```

# Graphql testing on site

Using this link you swap around different stores - but just one at a time.

https://shopify-graphiql-app.shopifycloud.com/login

# Cache problems

```bash
heroku config:set NODE_MODULES_CACHE=false -a APP
git commit -am 'disable node_modules cache' --allow-empty
git push heroku master
```

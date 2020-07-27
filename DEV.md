## Make migrations

This works quite nicely.

```bash
npm install --save-dev github:scimonster/sequelize-auto-migrations#a063aa6535a3f580623581bf866cef2d609531ba

node ./node_modules/sequelize-auto-migrations/bin/makemigration.js --name <migration name>
```

## Make uml diagrams

This works quite nicely, an example is in ``src/scripts/erd.js``.

```bash
npm install --save-dev sequelize-erd
```

## Delete all tables

```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
COMMENT ON SCHEMA public IS 'standard public schema';
```

## Rebuild tables

```bash
node ./node_modules/sequelize-auto-migrations/bin/makemigration.js --name boxes
npx seuelize-cli db:migrate
npx sequelize-cli db:seed --seed shopify-boxes
npx sequelize-cli db:seed --seed boxes
npx sequelize-cli db:seed --seed products
```

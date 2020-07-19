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

## Model to json

This works quite nicely.

```javascript
const db = require('../models');

(async function(){
  const Product = db['Product'];
  const products = await Product.findAll();
  console.log(products[0].toJSON());
})();
```

//const orderCreate = require('./webhooks/orders/create');
//const orderUpdated = require('./webhooks/orders/updated');
//const fs = require('fs');

//const order = require('./order.json');
//const ShopId = 1;
//const webhook = { payload: order };

//orderUpdated(webhook, ShopId);
//orderCreate(webhook, ShopId);

const box = require('@cousinsd/shopify-boxes-client');

test('module exists', () => expect(box).not.toBe('undefined'));

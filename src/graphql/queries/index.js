const {
  BoxQueries,
  BoxMutations,
} = require('./box');
const {
  ProductQueries,
  ProductMutations,
} = require('./product');
const {
  BoxProductQueries,
  BoxProductMutations,
} = require('./boxproduct');
const {
  CacheQueries,
} = require('./cache');
const {
  OrderQueries,
  OrderMutations,
} = require('./order');
const {
  ShopifyQueries,
  ShopifyMutations,
} = require('./shopify');
const {
  SubscriptionTypeQueries,
  SubscriptionTypeMutations,
} = require('./subscriptiontype');
const BuildOrderQueries = require('./build-order-queries');

module.exports = {
  BoxQueries,
  BoxMutations,
  ProductQueries,
  ProductMutations,
  BoxProductQueries,
  BoxProductMutations,
  OrderQueries,
  OrderMutations,
  ShopifyQueries,
  ShopifyMutations,
  SubscriptionTypeQueries,
  SubscriptionTypeMutations,
  BuildOrderQueries,
  CacheQueries,
};


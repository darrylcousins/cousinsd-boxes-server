const models = require('../../db/models');

const resolvers = {
  ShopifyBox: {
    async boxes(instance, args, context, info) {
      return instance.Boxes;
    },
    async shopify_product_gid(instance, args, context, info) {
      return instance.getShopifyGid();
    },
  },
  Query: {
  },
  Mutation: {
  },
};

module.exports = resolvers;



const { Op } = require("sequelize");
const { Product } = require('../../db/models');

const resolvers = {
  Product: {
    async boxes(instance, args, context, info) {
      return await instance.Boxes;
    },
    async isAddOn(instance, args, context, info) {
      return await instance.BoxProduct.isAddOn;
    },
    async shopify_product_gid(instance, args, context, info) {
      return`gid://shopify/Product/${instance.shopify_product_id}`;
    },
  },
  Query: {
  },
  Mutation: {
  },
};

module.exports = resolvers;

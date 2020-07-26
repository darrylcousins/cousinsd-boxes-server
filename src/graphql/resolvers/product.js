const { Op } = require("sequelize");
const parseFields = require('graphql-parse-fields')
const { filterFields } = require('../../lib');
const { Product } = require('../../db/models');
const models = require('../../db/models');

const getProductAttributes = (fields) => {
  return filterFields(fields)
    .filter(el => el != 'isAddOn')
    .filter(el => el != 'shopify_gid');
};

const resolvers = {
  Product: {
    async boxes(instance, args, context, info) {
      return await instance.Boxes;
    },
    async isAddOn(instance, args, context, info) {
      if (instance.BoxProduct) return await instance.BoxProduct.isAddOn;
      return null;
    },
    async shopify_gid(instance, args, context, info) {
      return instance.getShopifyGid();
    },
  },
  Query: {
    async getAllProducts(instance, args, context, info) {
      const fields = parseFields(info);
      return await models.Product.findAll({
        attributes: getProductAttributes(fields),
        order: [['shopify_title']],
      });
    },
  },
  Mutation: {
    async toggleProductAvailable (root, { input }, { models }, info) {
      const { id, available } = input;
      await Product.update(
        { available },
        { where: { id } }
      );
      return Product.findOne({ 
        where: { id },
      });
    },
  },
};

module.exports = resolvers;

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
  },
  Query: {
  },
  Mutation: {
  },
};

module.exports = resolvers;

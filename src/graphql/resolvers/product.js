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
    async getProduct(root, { input }, { models }, info){
      const { id } = input;
      return Product.findOne({ 
        where: { id },
      });
    },
    async getProducts(root, { input }, { models }, info) {
      const { available } = input;
      const where = typeof(available) == 'undefined' ? [true, false] : [available];
      const products = await Product.findAll({
        where: {
          available: {
            [Op.in]: where
          }
        },
        order: [['title', 'ASC']],
      });
      return products
    },
  },
  Mutation: {
    async createProduct (root, { input }, { models }, info) {
      return Product.create(input);
    },
    async updateProduct (root, { input }, { models }, info) {
      const { id, ...props } = input;
      await Product.update(
        props,
        { where: { id } }
      );
      return Product.findOne({ 
        where: { id },
      });
    },
    async deleteProduct (root, { input }, { models }, info) {
      /* id */
      const { id } = input;
      Product.destroy({ where: { id } });
      return id;
    },
    async toggleProductAvailable (root, { input }, { models }, info) {
      const { id, ...props } = input;
      await Product.update(
        props,
        { where: { id } }
      );
      return Product.findOne({ 
        where: { id },
      });
    },
  },
};

module.exports = resolvers;

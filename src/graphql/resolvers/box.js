const { Op } = require("sequelize");
const { Box, Product } = require('../../db/models');
const { dateToISOString, filterFields } = require('../../lib');
const sequelize = require('sequelize');
const parseFields = require('graphql-parse-fields')

const resolvers = {
  Box: {
    async products(instance, args, context, info) {
      return instance.Products.filter(product => !product.BoxProduct.isAddOn);
    },
    async addOnProducts(instance, args, context, info) {
      return instance.Products.filter(product => product.BoxProduct.isAddOn);
    },
  },
  Query: {
    async getAllBoxes(root, { input }, { models }, info) {
      const fields = parseFields(info);
      const boxes = await Box.findAll({
        attributes: filterFields(fields),
        include: [
          {
            model: Product,
            attributes: filterFields(fields.products).filter(el => el !== 'isAddOn'),
            through: {
              attributes: ['isAddOn'],
            }
          },
        ]
      });
      console.log(boxes[0].createdAt);
      return boxes;
    },
    async getSelectedBoxes(root, { input }, { models }, info) {
      let { delivered, limit, offset } = input;
      const fields = parseFields(info);
      const where = { delivered: {[Op.eq]: delivered} };
      const boxes = await Box.findAndCountAll({
        where,
        limit,
        offset,
        order: [['delivered', 'ASC']],
        attributes: filterFields(fields),
        include: [
          {
            model: Product,
            attributes: filterFields(fields.products).filter(el => el !== 'isAddOn'),
            through: {
              attributes: ['isAddOn'],
            }
          },
        ]
      });
      return orders;
    },
  },
  Mutation: {
  },
};

module.exports = resolvers;

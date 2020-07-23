const { Op } = require("sequelize");
const models = require('../../db/models');
const { dateToISOString } = require('../../lib');
const sequelize = require('sequelize');

const resolvers = {
  Order: {
  },
  Query: {
    async getOrders(root, { input }, context, info) {
      let { delivered, limit, offset, shopify_product_id, shopify_name } = input;
      if (!delivered) delivered = dateToISOString(new Date());
      const where = { delivered: {[Op.eq]: delivered} };
      if (shopify_product_id) where.shopify_product_id = shopify_product_id;
      if (shopify_name) where.shopify_name = shopify_name;
      const orders = await models.Order.findAndCountAll({
        where,
        limit,
        offset,
        order: [['delivered', 'ASC']],
      });
      return orders;
    },
  },
  Mutation: {
  },
};

module.exports = resolvers;

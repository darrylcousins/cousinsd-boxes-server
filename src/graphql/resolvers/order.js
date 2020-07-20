const { Op } = require("sequelize");
const { Order } = require('../../db/models');
const { dateToISOString } = require('../../lib');
const sequelize = require('sequelize');

const resolvers = {
  Order: {
  },
  Query: {
    async getOrder(root, { input }, { models }, info){
      const { id } = input;
      const order = await Order.findOne({ 
        where: { id },
      });
      return order;
    },
    async getOrders(root, { input }, { models }, info) {
      let { delivered, limit, offset, shopify_product_id, shopify_name } = input;
      if (!delivered) delivered = dateToISOString(new Date());
      const where = { delivered: {[Op.eq]: delivered} };
      if (shopify_product_id) where.shopify_product_id = shopify_product_id;
      if (shopify_name) where.shopify_name = shopify_name;
      const orders = await Order.findAndCountAll({
        where,
        limit,
        offset,
        order: [['delivered', 'ASC']],
      });
      return orders;
    },
    async getOrderDates(root, { input }, { models }, info){
      const dates = await Order.findAll({
        attributes: ['delivered', [sequelize.fn('count', sequelize.col('id')), 'count']],
        group: ['delivered'],
        order: [['delivered', 'ASC']],
      });
      // coerce from array of Orders to simple json
      const data = []
      dates.map((date) => {
          data.push(date.toJSON())
      })
      return data;
    },
    async checkOrderDuplicate(root, { input }, { models }, info) {
      let { delivered, shopify_product_id, shopify_customer_id } = input;
      const order = await Order.findOne({
        where: { delivered: {[Op.eq]: delivered}, shopify_product_id, shopify_customer_id },
      });
      return order;
    },
  },
  Mutation: {
    async updateOrderName(root, { input }, { models }, info) {
      let { shopify_order_id, shopify_name } = input;
      const order = await Order.findOne({
        where: { shopify_order_id },
      });
      await Order.update(
        { shopify_name },
        { where: { shopify_order_id } }
      );
      return await Order.findOne({ 
        where: { shopify_order_id },
      });
    },
  },
};

module.exports = resolvers;

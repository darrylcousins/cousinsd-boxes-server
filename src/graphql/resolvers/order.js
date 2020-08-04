const { Op } = require("sequelize");
const models = require('../../db/models');
const { UTCDateOnly, dateToISOString, filterFields } = require('../../lib');
const sequelize = require('sequelize');
const parseFields = require('graphql-parse-fields')

const resolvers = {
  Order: {
    async delivered(instance, args, context, info) {
      return instance.Box.delivered;
    },
    async box(instance, args, context, info) {
      return instance.Box;
    },
    async customer(instance, args, context, info) {
      return instance.Customer;
    },
    async shopify_product_id(instance, args, context, info) {
      return instance.ShopifyBox.shopify_product_id;
    },
    async shopify_customer_id(instance, args, context, info) {
      if (instance.Customer) return instance.Customer.shopify_customer_id;
      return null;
    },
  },
  Query: {
    async getOrders(root, { input }, context, info) {

      const fields = parseFields(info);

      let { delivered, limit, offset, shopify_product_id, shopify_title } = input;
      if (!delivered) delivered = new Date();

      delivered = new Date(delivered).toUTCString();

      const where = {};
      if (shopify_title) where.shopify_title = {[Op.substring]: shopify_title};

      const shopifyWhere = {};
      if (shopify_product_id) shopifyWhere.shopify_product_id = shopify_product_id;

      const orders = await models.Order.findAndCountAll({
        limit,
        offset,
        where,
        attributes: filterFields(fields.rows),
        include: [
          {
            model: models.Box,
            attributes: filterFields(fields.rows.box),
            where: { 'delivered': {[Op.eq]: delivered} },
            include: {
              model: models.ShopifyBox,
              attributes: filterFields(fields.rows.box.shopifyBox),
              where: shopifyWhere,
            },
          },
          {
            model: models.Customer,
            attributes: filterFields(fields.rows.customer),
          },
        ],
      });
      return orders;
    },
    async getOrdersDeliveredAndCount(root, { input }, context, info){

      const dates = await models.Order.findAll({
        attributes: [ 
          [sequelize.fn('count', sequelize.col('Order.id')), 'count'],
          [sequelize.col('Box.delivered'), 'delivered']
        ],
        include: [{
          model: models.Box,
          attributes:[],
        }],
        group: ['Box.delivered']     
      });

      const data = [];
      dates.map((date) => {
        if (date) {
          data.push(date.toJSON());
        };
      });
      return data;
    },
  },
  Mutation: {
  },
};

module.exports = resolvers;

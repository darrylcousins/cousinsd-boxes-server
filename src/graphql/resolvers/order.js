const { Op } = require("sequelize");
const models = require('../../db/models');
const { dateToISOString } = require('../../lib');
const sequelize = require('sequelize');

const resolvers = {
  Order: {
    async delivered(instance, args, context, info) {
      return instance.Box.delivered;
    },
    async shopify_product_id(instance, args, context, info) {
      return instance.ShopifyBox.shopify_product_id;
    },
    async shopify_customer_id(instance, args, context, info) {
      if (instance.Subscriber) return instance.Subscriber.shopify_customer_id;
      return null;
    },
  },
  Query: {
    async getOrders(root, { input }, context, info) {
      let { delivered, limit, offset, shopify_product_id, shopify_title } = input;
      if (!delivered) delivered = dateToISOString(new Date());
      // TODO find ShopifyBoxId
      //if (shopify_product_id) where.shopify_product_id = shopify_product_id;

      const where = {};
      if (shopify_title) where.shopify_title = shopify_title;

      const shopifyWhere = {};
      if (shopify_product_id) shopifyWhere.shopify_product_id = shopify_product_id;

      const orders = await models.Order.findAndCountAll({
        limit,
        offset,
        where,
        include: [
          {
            model: models.Box,
            attributes: ['delivered'],
            where: { 'delivered': {[Op.eq]: delivered} },
            include: {
              model: models.ShopifyBox,
              attributes: ['shopify_product_id'],
              where: shopifyWhere,
            },
          },
        ],
      });
      //console.log(JSON.stringify(orders, null, 2));
      return orders;
    },
    async getOrdersDeliveredAndCount(root, { input }, context, info){
      const dates = await models.Order.findAll({
        attributes: [ 
          [sequelize.fn('count', sequelize.col('Order.id')), 'count']
        ],
        include: [{
          model: models.Box,
          attributes:['delivered']
        }],
        group: ['Order.id', 'Box.id']     
      })

      // coerce from array of Orders to simple json
      const data = []
      dates.map((date) => {
        const json = date.toJSON();
        data.push({ count: json.count, delivered: json.Box.delivered })
      })
      console.log(data);
      return data;
    },
  },
  Mutation: {
  },
};

module.exports = resolvers;

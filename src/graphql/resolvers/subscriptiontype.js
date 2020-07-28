const { UserInputError } = require("apollo-server-koa");
const { Op } = require("sequelize");
const parseFields = require('graphql-parse-fields')
const models = require('../../db/models');
const { filterFields } = require('../../lib');

const getSubscriptionTypeIncludes = (where) => {
  return [
    {
      model: models.ShopifyBox,
      attributes: ['shopify_product_id', 'shopify_product_title'],
      where: where,
    },
    {
      model: models.Subscription,
      include: {
        model: models.Subscriber,
        include: {
          model: models.Customer,
          attributes: ['shopify_customer_id'],
        }
      }
    },
  ]
};

const resolvers = {
  SubscriptionType: {
    async shopify_product_id(instance, args, context, info) {
      return await instance.ShopifyBox.shopify_product_id;
    },
    async shopify_box_title(instance, args, context, info) {
      return await instance.ShopifyBox.shopify_title;
    },
  },
  Query: {
    async getSubscriptionTypes(root, { input }, context, info) {
      /* shopify_product_id */
      const { shopify_product_id } = input;
      const fields = parseFields(info);
      const where = shopify_product_id ? { shopify_product_id } : null;
      const types = await models.SubscriptionType.findAll({
        attributes: filterFields(fields).filter(el => el != 'shopify_product_id'),
        include: getSubscriptionTypeIncludes(where),
      });
      return types;
    },
  },
  Mutation: {
    async createSubscriptionType(root, { input }, context, info) {
      const { shopify_product_id, title, frequency, duration, description, discount } = input;

      const shopifyBox = await models.ShopifyBox.findOne({
        where: { shopify_product_id },
        attributes: ['id'],
      });

      const subscriptionType = await models.SubscriptionType.create({
        title,
        description,
        discount,
        duration,
        frequency,
        ShopifyBoxId: shopifyBox.id
      });
      //console.log(subscriptionType.toJSON());
      return subscriptionType;
    },
    async updateSubscriptionType(root, { input }, context, info) {
      /* title, duration, frequency, shopifyBoxId */
      const { shopify_product_id, title, frequency, duration, description, discount } = input;
      const shopifyBox = await models.ShopifyBox.findOne({
        where: { shopify_product_id },
        attributes: ['id'],
      });
      const subscriptionType = await models.SubscriptionType.create({
        title,
        description,
        discount,
        duration,
        frequency,
        ShopifyBoxId: shopifyBox.id
      });
      //console.log(subscriptionType.toJSON());
      return subscriptionType;
    },
    async deleteSubscriptionType(root, { input }, context, info) {
      const { id } = input;
      const box = await models.SubscriptionType.findByPk(id);
      await models.SubscriptionType.destroy({ where: { id } });
      return id;
    },
  },
};

module.exports = resolvers;



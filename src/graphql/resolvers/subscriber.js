const models = require('../../db/models');

const resolvers = {
  Subscriber: {
    async subscriptions(instance, args, context, info) {
      return await instance.getSubscriptions();
    },
    async shopify_customer_id(instance, args, context, info) {
      return await instance.Customer.shopify_customer_id();
    },
  },
  Query: {
    async getSubscriber(root, { input }, context, info) {
      const { uid } = input;
      const subscriber = await models.Subscriber.findOne({ 
        where: { uid },
      });
      return subscriber;
    },
    async getSubscribers(root, { input }, context, info) {
      const subscribers = await models.Subscriber.findAll({
      });
      return subscribers;
    },
  },
  Mutation: {
    async createSubscriber (root, { input }, context, info) {
      return models.Subscriber.create(input);
    },
    async deleteSubscriber (root, { input }, context, info) {
      /* id */
      const { uid } = input;
      return models.Subscriber.destroy({ where: { uid } });
    },
  },
};

module.exports = resolvers;


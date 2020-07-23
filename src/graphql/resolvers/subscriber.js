const models = require('../../db/models');

const resolvers = {
  Subscriber: {
    async subscriptions(instance, args, context, info) {
      return await instance.getSubscriptions();
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
    async updateSubscriber (root, { input }, context, info) {
      const { uid, ...props } = input;
      await models.Subscriber.update(
        props,
        { where: { uid } }
      );
      return models.Subscriber.findOne({ 
        where: { uid },
      });
    },
    async deleteSubscriber (root, { input }, context, info) {
      /* id */
      const { uid } = input;
      return models.Subscriber.destroy({ where: { uid } });
    },
  },
};

module.exports = resolvers;


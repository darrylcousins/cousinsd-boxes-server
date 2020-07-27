const { merge } = require('lodash');
const BoxResolvers = require('./box');
const ProductResolvers = require('./product');
const BoxProductResolvers = require('./boxproduct');
const CustomerResolvers = require('./customer');
const OrderResolvers = require('./order');
const SubscriptionResolvers = require('./subscription');
const SubscriberResolvers = require('./subscriber');
const SubscriptionTypeResolvers = require('./subscriptiontype');
const BigInt = require('graphql-bigint');
const GraphQLJSON = require('graphql-type-json');
const { GraphQLJSONObject } = require('graphql-type-json');
const GraphQLUUID = require('graphql-type-uuid');

// including a test hello world query
const resolvers = merge(
  { Query: { hello: () => 'world' } },
  { UUID: GraphQLUUID },
  { JSON: GraphQLJSON, JSONObject: GraphQLJSONObject },
  { BigInt },
  ProductResolvers,
  BoxResolvers,
  BoxProductResolvers,
  CustomerResolvers,
  OrderResolvers,
  SubscriptionResolvers,
  SubscriberResolvers,
  SubscriptionTypeResolvers,
);


module.exports = resolvers;

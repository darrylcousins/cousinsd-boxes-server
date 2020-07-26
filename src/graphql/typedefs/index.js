const { gql } = require('@apollo/client');
const { makeExecutableSchema } = require('graphql-tools');

const product = require('./product');
const box = require('./box');
const boxproduct = require('./boxproduct');
const order = require('./order');
const subscription = require('./subscription');
const subscriber = require('./subscriber');
const shopify_box = require('./shopifybox');
const subscription_type = require('./subscriptiontype');

const root = gql`
  scalar BigInt
  scalar JSON
  scalar JSONObject
  scalar UUID

  type Query {
    "A simple type for getting started!"
    hello: String
  }

  type Mutation {
    _empty: String
  }

  type DeliveredAndCount {
    delivered: String!
    count: Int!
  }

`;

const typeDefs = [
  root, 
  product, 
  box, 
  boxproduct,
  order, 
  subscription, 
  subscriber,
  subscription_type,
  shopify_box,
];

module.exports = typeDefs;

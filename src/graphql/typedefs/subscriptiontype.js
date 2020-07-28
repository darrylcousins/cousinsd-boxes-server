const { gql } = require('@apollo/client');

const subscription_type = gql`
  type SubscriptionType {
    id: ID!
    title: String!
    description: String!
    discount: Int!
    duration: Int!
    frequency: Int!
    shopify_product_id: BigInt!
    shopify_box_title: String!
    subscriptions: [Subscription]
    ShopifyBox: ShopifyBox
  }

  input SubscriptionTypeInput {
    title: String!
    description: String!
    discount: Int!
    duration: Int
    frequency: Int
    shopify_product_id: BigInt!
  }

  input SubscriptionTypeFilterInput {
    shopify_product_id: BigInt
  }

  extend type Query {
    getSubscriptionTypes(input: SubscriptionTypeFilterInput!): [SubscriptionType]
  }

  extend type Mutation {
    createSubscriptionType(input: SubscriptionTypeInput!): SubscriptionType
    updateSubscriptionType(input: SubscriptionTypeInput!): SubscriptionType
    deleteSubscriptionType(input: IdInput!): Boolean
  }
`;

module.exports = subscription_type;

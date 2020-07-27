const { gql } = require("apollo-server-koa");

const subscriber = gql`
  type Subscriber {
    id: ID!
    uid: UUID!
    shopify_customer_id: BigInt!
    createdAt: String!
    updatedAt: String!
    subscriptions: [Subscription]
    orders: [Order]
  }

  input SubscriberInput {
    id: ID
    uid: UUID!
    shopify_customer_id: BigInt!
  }

  input SubscriberUUIDInput{
    uid: UUID!
  }

  extend type Query {
    getSubscriber(input: SubscriberUUIDInput!): Subscriber
    getSubscribers: [Subscriber]
  }

  extend type Mutation {
    createSubscriber(input: SubscriberInput!): Subscriber
    updateSubscriber(input: SubscriberInput!): Subscriber
    deleteSubscriber(input: SubscriberUUIDInput!): UUID
  }
`;

module.exports = subscriber;


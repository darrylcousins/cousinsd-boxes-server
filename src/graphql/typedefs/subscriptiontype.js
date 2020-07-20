const { gql } = require('@apollo/client');

const subscription_type = gql`
  type SubscriptionType {
    id: ID!
    duration: Int!
    frequency: Int!
  }
`;

module.exports = subscription_type;

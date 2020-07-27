const { gql } = require("apollo-server-koa");

const customer = gql`
  type Customer {
    id: ID!
    shopify_customer_id: BigInt!
    createdAt: String!
    updatedAt: String!
  }
`;

module.exports = customer;



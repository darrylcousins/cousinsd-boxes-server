const { gql } = require('@apollo/client');

const SubscriptionParts = `
  id
  uid
  frequency
  current_cart
  last_cart
  shopify_product_id
  shopify_customer_id
  subscriber
  orders: [Order]
`;

const SubscriptionQueries = {
  getSubscriptions: gql`
    query getSubscriptions($input: SubscriptionFilterInput!) {
      getSubscriptions(input: $input) {
        ${SubscriptionParts}
      }
    }
  `,
}

const SubscriptionMutations = {
}

module.exports = {
  SubscriptionQueries,
  SubscriptionMutations,
};



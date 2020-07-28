const { gql } = require('@apollo/client');

const SubscriptionTypeParts = `
  id
  title
  description
  discount
  shopify_product_id
  duration
  frequency
`;

const SubscriptionTypeIncludeParts = `
  subscriptions {
    uid
  }
  ShopifyBox {
    shopify_product_id
      boxes {
        id
      }
    }
  }
`;

const SubscriptionTypeQueries = {
  getSubscriptionTypes: gql`
    query getSubscriptionTypes($input: SubscriptionTypeFilterInput!) {
      getSubscriptionTypes(input: $input) {
        ${SubscriptionTypeParts}
      }
    }
  `,
}

const SubscriptionTypeMutations = {
  createSubscriptionType: gql`
    mutation createSubscriptionType($input: SubscriptionTypeInput!) {
      createSubscriptionType(input: $input)
    }
  `,
  updateSubscriptionType: gql`
    mutation updateSubscriptionType($input: SubscriptionTypeInput!) {
      updateSubscriptionType(input: $input)
    }
  `,
  deleteSubscriptionType: gql`
    mutation deleteSubscriptionType($input: IdInput!) {
      deleteSubscriptionType(input: $input)
    }
  `,
}

module.exports = {
  SubscriptionTypeQueries,
  SubscriptionTypeMutations,
};


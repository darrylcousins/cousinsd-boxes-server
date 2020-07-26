const { gql } = require('@apollo/client');

const BoxParts = `
  id
  shopify_title
  shopify_handle
  shopify_variant_id
  shopify_product_id
  shopify_product_gid
  shopify_price
  delivered
`;

const ProductParts = `
  id
  isAddOn
  shopify_title
  shopify_handle
  shopify_id
  shopify_gid
  shopify_variant_id
  shopify_price
  available
`;

const ProductBoxParts = `
  boxes {
    ${BoxParts}
  }
`;

const ProductQueries = {
  getAllProducts: gql`
    query {
      getAllProducts {
        ${ProductParts}
      }
    }
  `,
}

const ProductMutations = {
  toggleProductAvailable: gql`
    mutation toggleProductAvailable($input: ProductAvailableInput!) {
      toggleProductAvailable(input: $input) {
        id
      }
    }
  `,
}

module.exports = {
  ProductParts,
  ProductQueries,
  ProductMutations,
};

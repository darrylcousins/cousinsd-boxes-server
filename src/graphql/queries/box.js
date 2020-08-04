const { gql } = require('@apollo/client');
const { ProductParts } = require('./product');

const BoxParts = `
  id
  delivered
  shopifyBox {
    shopify_title
    shopify_handle
    shopify_variant_id
    shopify_product_id
    shopify_product_gid
    shopify_price
  }
`;

const BoxProductParts = `
  products {
    ${ProductParts}
  }
  addOnProducts {
    ${ProductParts}
  }
`;

// two fragments are identical but wouldn't work on a single definition
const BoxQueries = {
  getBox: gql`
    query getBox($input: IdInput!) {
      getBox(input: $input) {
        ${BoxParts}
        ${BoxProductParts}
      }
    }
  `,
  getBoxProducts: gql`
    query getBoxProducts($input: IdInput!) {
      getBoxProducts(input: $input) {
        id
        ${BoxProductParts}
      }
    }
  `,
  getAllBoxes: gql`
    query {
      getAllBoxes {
        ${BoxParts}
        ${BoxProductParts}
      }
    }
  `,
  getBoxesByShopifyBox: gql`
    query getBoxesByShopifyBox($input: BoxShopifyBoxSearchInput!) {
      # input: shopify_product_id, offset, limit
      getBoxesByShopifyBox(input: $input) {
        count
        rows {
          ${BoxParts}
          ${BoxProductParts}
        }
      }
    }
  `,
  getBoxesByDelivered: gql`
    query getBoxesByDelivered($input: BoxDeliveredSearchInput!) {
      # input: delivered, offset, limit
      getBoxesByDelivered(input: $input) {
        count
        rows {
          ${BoxParts}
          ${BoxProductParts}
        }
      }
    }
  `,
  getAllBoxesByDelivered: gql`
    query getAllBoxesByDelivered($input: BoxDeliveredInput!) {
      # input: delivered
      getAllBoxesByDelivered(input: $input) {
        ${BoxParts}
        ${BoxProductParts}
      }
    }
  `,
  getBoxesDeliveredAndCount: gql`
    query {
      getBoxesDeliveredAndCount {
        delivered
        count
      }
    }
  `,
}

const BoxMutations = {
  createBox: gql`
    mutation createBox($input: BoxInput!) {
      # input: delivered, shopify_title, shopify_handle, shopify_variant_id, shopify_product_id, shopify_price
      createBox(input: $input) {
        ${BoxParts}
        ${BoxProductParts}
      }
    }
  `,
  updateBox: gql`
    mutation updateBox($input: BoxUpdateInput!) {
      updateBox(input: $input) {
        id
      }
    }
  `,
  deleteBox: gql`
    mutation deleteBox($input: IdInput!) {
      deleteBox(input: $input)
    }
  `,
  duplicateBox: gql`
    mutation duplicateBox($input: BoxDuplicateInput!) {
      duplicateBox(input: $input) {
        ${BoxParts}
      }
    }
  `,
}

module.exports = {
  BoxParts,
  BoxQueries,
  BoxMutations,
};

const { gql } = require('@apollo/client');

const BoxProductQueries = {
}

const BoxProductMutations = {
  createBoxProducts: gql`
    mutation createBoxProducts($input: BoxProductGidsInput!) {
      createBoxProducts(input: $input)
    }
  `,
  removeBoxProduct: gql`
    mutation removeBoxProduct($input: BoxProductInput!) {
      removeBoxProduct(input: $input)
    }
  `,
}

module.exports = {
  BoxProductQueries,
  BoxProductMutations,
};

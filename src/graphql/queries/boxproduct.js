const { gql } = require('@apollo/client');

const BoxProductQueries = {
}

const BoxProductMutations = {
  addBoxProducts: gql`
    mutation addBoxProducts($input: BoxProductGidsInput!) {
      addBoxProducts(input: $input)
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

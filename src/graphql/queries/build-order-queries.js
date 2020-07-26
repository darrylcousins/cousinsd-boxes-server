const { gql } = require('@apollo/client');

/* full query to populate table data */
const mainQuery = `
  order@idx: order(id: "@id") {
    id
    name
    displayFinancialStatus
    displayFulfillmentStatus
    note
    customer {
      email
      phone
    }
    shippingAddress {
      name
      address1
      address2
      city
      province
      zip
    }
    lineItems(first: 10) {
      edges {
        node {
          id
          name
          fulfillmentStatus
          product {
            id
            productType
            handle
          }
          quantity
          customAttributes {
            key
            value
          }
        }
      }
    }
  }
`;

/* export query to populate csv export data */
const exportQuery = `
  order@idx: order(id: "@id") {
    id
    name
    note
    customer {
      email
      phone
      firstName
      lastName
    }
    shippingAddress {
      name
      firstName
      lastName
      phone
      address1
      address2
      city
      province
      zip
    }
    lineItems(first: 10) {
      edges {
        node {
          id
          name
          product {
            id
            productType
            handle
          }
          quantity
          customAttributes {
            key
            value
          }
        }
      }
    }
  }
`;

/* just enough information to print picking list */
const shortQuery = `
  order@idx: order(id: "@id") {
    lineItems(first: 10) {
      edges {
        node {
          customAttributes {
            key
            value
          }
          product {
            productType
            handle
          }
          quantity
        }
      }
    }
  }
`;

/*
 * constructing an order query
{ order1: order(id:"gid://shopify/Order/1248358563862") .. }
*/
function queryHelper(ids, queryTemplate) {
  const gid = 'gid://shopify/Order/';
  const queries = ids.map((id, idx) => queryTemplate
    .replace(`@idx`, idx)
    .replace(`@id`, `${gid}${id}`)
    .trim()
  )
  return gql`
    query fetchData {
      ${queries.join(`\n`)}
    }
  `;
};

const getMainQuery = (ids) => queryHelper(ids, mainQuery);
const getShortQuery = (ids) => queryHelper(ids, shortQuery);
const getExportQuery = (ids) => queryHelper(ids, exportQuery);

module.exports = {
  getMainQuery,
  getShortQuery,
  getExportQuery,
};


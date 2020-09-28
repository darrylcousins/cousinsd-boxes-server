//const SHOPIFY_API_KEY='d585698ca1aa5356af0726b6c3890183';
//const SHOPIFY_API_SECRET_KEY='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';

/* 
 * private app called 'cousinsd-boxes' on streamside
*/

require('isomorphic-fetch');
const fs = require('fs');
const csv = require('csv');

const SHOPIFY_API_PASSWORD='*';
const API_VERSION='2020-07';
const SHOP_NAME='streamsideorganics';
const LABELKEYS = [
  'Delivery Date', 
  'Including', 
  'Add on items', 
  'Removed items', 
  'Subscription',
  'Add on product to',
  'ShopID',
];

/*
 * lib methods
 */
const getFetch = (query) => {
  return fetch(`https://${SHOP_NAME}.myshopify.com/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_API_PASSWORD 
    },
    body: JSON.stringify({ query: query }),
  })
};

/*
 * fetch methods
 */

//const QUERY = 'query { shop { id name email } }';
const getIds = () => {
  const query = `
    query {
      orders(first:100,
      query: "fulfillment_status:unshipped AND financial_status:paid"
      ) {
        edges {
          node {
            id
          }
        }
      }
    }
  `;

  return getFetch(query)
    .then(res => res.json())
    .then(res => res.data.orders.edges.map(edge => edge.node.id));
};

const getOrder = (id, first, cursor) => {
  const query = `
    query {
      order(id: "${id}") {
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
          phone
          address1
          address2
          city
          province
          zip
        }
        lineItems(first: ${first}, after: ${cursor}) {
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
          edges {
            node {
              id
              name
              sku
              product {
                id
                productType
                handle
                title
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
    }
  `;
  return getFetch(query)
    .then(res => res.json())
    .then(res => {
      if (res.data) {
        return 'got data';
        return res.data.order.lineItems.edges.map(el => el.node.customAttributes);
      } else {
        return res
      };
      res.data.order.lineItems.edges.map(lineItem => {
        var properties = lineItem.node.customAttributes.reduce(
          (acc, curr) => Object.assign(acc, { [`${curr.key}`]: curr.value }),
          {});
        return properties['ShopID'];
      });

    });
};

const getOrders = (query) => {
  return getFetch(query)
    .then(res => res.json())
    .then(res => {
      if (res.data) {
        //console.log(res.data);
        return res.data;
        //return res.data.order.lineItems.edges.map(el => el.node.customAttributes);
      } else {
        return res
      };
    });
};

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
      phone
      address1
      address2
      city
      province
      zip
    }
    lineItems(first: 5) {
      edges {
        node {
          id
          name
          sku
          product {
            id
            productType
            handle
            title
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

function buildQuery(ids) {
  const queries = ids.map((id, idx) => exportQuery
    .replace(`@idx`, idx)
    .replace(`@id`, `${id}`)
    .trim()
  )
  return `
    query fetchData {
      ${queries.join(`\n`)}
    }
  `;
};

const makeThrottledPromise = (promise, count) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      promise
        .then(res => resolve(res))
        .catch(err => reject(err));
    }, 4000*count);
  });
};

const matchNumberedString = (str) => {
  // e.g. 'Baby Kale (2)' => 'Baby Kale', 2
  str = str.trim();
  let count = 0;
  const match = str.match(/\(\d+\)$/);
  if (match) {
    count = parseInt(str.slice(match.index+1, match.index+match[0].length-1));
    str = str.slice(0, match.index).trim();
  }
  return { str, count };
};

const stripName = (str) => {
  return str.toLowerCase().replace(/-/, '').trim();
};

const nameSort = (a, b) => {
  const prodA = stripName(a);
  const prodB = stripName(b);
  if (prodA > prodB) return 1;
  if (prodA < prodB) return -1;
  return 0;
}

const processOrders = (data, deliveryDate) => {

  let rows = [];
  let pickingList = new Map();
  data.forEach(el => {
    if (el.errors) {
      console.log('ERRORS', el.errors);
      return;
    }
    const length = Object.keys(el).length;
    let counter = 0;
    const [deliveryKey, includingKey, addonKey, removedKey, subscriptionKey, boxKey, uidCodeKey] = LABELKEYS;
    for (let j=0; j<length; j++) {
      let order = el[`order${j}`];
      console.log('order;', order.name);
      let addons = [];
      let including = [];
      let removed = [];
      let delivered = '';
      let item = order.lineItems.edges[0].node;
      var properties = item.customAttributes.reduce(
        (acc, curr) => Object.assign(acc, { [`${curr.key}`]: curr.value }),
        {});

      if (deliveryKey in properties) delivered = properties[deliveryKey];
      if (includingKey in properties) including = properties[includingKey]
        .split(',').map(el => el.trim()).filter(el => el !== '');
      if (addonKey in properties) addons = properties[addonKey]
        .split(',').map(el => el.trim()).filter(el => el !== '');
      if (removedKey in properties) removed = properties[removedKey]
        .split(',').map(el => el.trim()).filter(el => el !== '');

      if (delivered === deliveryDate) {
        /*
        including.forEach(el => {
          if (pickingList.has(el)) {
            pickingList.set(el, pickingList.get(el) + 1);
          } else {
            pickingList.set(el, 1);
          }
        });
        */
        addons.forEach(el => {
          let { str, count } = matchNumberedString(el);
          if (count == 0) count = 1;
          if (pickingList.has(str)) {
            pickingList.set(str, pickingList.get(str) + count);
          } else {
            pickingList.set(str, count);
          }
        });
      }
      let address1 = '';
      let address2 = '';
      let city = '';
      let zip = '';
      let phone = '';
      let firstName = '';
      let lastName = '';
      if (order.shippingAddress) {
        let shipping = order.shippingAddress;
        address1 = shipping.address1; 
        address2 = shipping.address2 ? shipping.address2 : '';
        city = shipping.city; 
        zip = shipping.zip; 
        phone = shipping.phone; 
      };
      if (order.customer) {
        let customer = order.customer;
        firstName = customer.firstName; 
        lastName = customer.lastName; 
      };
      rows.push([
        '',
        item.sku,
        delivered,
        order.name,
        '',
        firstName,
        lastName,
        address1,
        address2,
        city,
        zip,
        phone,
        removed.join('\n'),
        addons.join('\n'),
        order.note,
        ''
      ]);
    };
  });

  const headers = [
    'Logo',
    'Box',
    'Delivered',
    'Order #',
    'Run Id',
    'First Name',
    'Last Name',
    'Address Line',
    'Suburb',
    'City',
    'Postcode',
    'Telephone',
    'Excluding',
    'Extras',
    'Delivery Note',
    'Shop Note'
  ]

  return { headers, rows, pickingList };
};

getIds().then(ids => {
  console.log(ids.length);
  let promises = [];
  var i,j,temparray,chunk = 5;
  for (i=0,j=ids.length; i<j; i+=chunk) {
    temparray = ids.slice(i,i+chunk);
    let query = buildQuery(temparray);
    let count = (i/chunk) + 1;
    promises.push(makeThrottledPromise(getOrders(query), count));
  }
  const deliveryDate = 'Sat Sep 26 2020';
  const deliveryString = deliveryDate.replace(/ /g, '-');
  Promise.all(promises)
    .then(data => {
      const { headers, rows, pickingList } = processOrders(data, deliveryDate);
      //console.log(JSON.stringify(rows, null, 2));
      rows.unshift(headers);
      // write to file
      csv.stringify(rows, {quoted_string: true, delimiter: ';'})
        .pipe(fs.createWriteStream(`data/orders-${deliveryString}.csv`));

      let countRows = [];
      const pickingMapKeys = Array.from(pickingList.keys()).sort(nameSort); 
      pickingMapKeys.forEach(key => {
        const value = pickingList.get(key);
        countRows.push([key, value.toString()]);
      });
      csv.stringify(countRows, {quoted_string: true, delimiter: ';'})
        .pipe(fs.createWriteStream(`data/picking-${deliveryString}.csv`));
      //console.log(JSON.stringify(countRows, null, 2));
    })
    .catch(err => console.log(err));
});




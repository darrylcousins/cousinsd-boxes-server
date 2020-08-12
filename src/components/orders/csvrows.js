import { parseNumberedString } from '../../lib';

const createCsvRows = ({ data, delivered }) => {

  const [delivery_date, including, addons, removed, subscription] = LABELKEYS;
  
  let rows = []

  data.forEach(el => {
    const orders = el.data;
    if (el.errors) {
      console.log('ERRORS', el.errors);
      return;
    }

    const length = Object.keys(orders).length;
    let counter = 0;
    for (let j=0; j<length; j++) {
      let order = orders[`order${j}`];

      let address = order.shippingAddress;
      var customer = order.customer;
      let deliveryNote = order.note;
      let addressLine1 = '';
      let addressLine2 = '';
      let city = '';
      let postcode = '';
      let firstName = '';
      let lastName = '';
      let telephone = '';

      if (address) {
        addressLine1 = address.address1;
        addressLine2 = address.address2;
        city = address.city;
        postcode = address.zip;
      };

      if (customer) {
        firstName = customer.firstName;
        lastName = customer.lastName;
        telephone = customer.phone ? customer.phone : '';
      };

      let orderName = order.name; // the order number
      let boxName; // the box title
      let addressArray = [];
      let includedItems = [];
      let removedItems = [];
      let addonItems = [];
      let deliveryDate;

      
      const lineItems = order.lineItems.edges;
      const itemsLength = lineItems.length;
      const isNull = (el) => el === null ? '' : el;
      
      var produce = Array();
      for (let j = 0; j < lineItems.length; j++) {
        let node = lineItems[j].node;

        // XXX TODO check for correct date for box association (hint: uses customAttributes)
        if (node.product.productType === 'Box Produce') {
          produce.push(node.product.title);
        }
      };

      let subRows = []
      for (let i = 0; i < itemsLength; i++) {
        /* make list of paid for products to draw upon */
        if (lineItems[i].node.product.productType === 'Container Box') {
          var customAttributes = lineItems[i].node.customAttributes.reduce(
            (acc, curr) => Object.assign(acc, { [`${curr.key}`]: curr.value }),
            {});
          //deliveryDate = dateToISOString(new Date(customAttributes[delivery_date]));
          deliveryDate = new Date(customAttributes[delivery_date]).toDateString();
          if (deliveryDate === new Date(delivered).toDateString()) {
            const lineItem = lineItems[i].node;
            boxName = lineItem.sku;

            includedItems = customAttributes[including].split(',').map(el => el.trim()).filter(el => el !== '');
            addonItems = customAttributes[addons].split(',').map(el => el.trim()).filter(el => el !== '');

            addonItems = addonItems.filter(el => {
              let title = parseNumberedString(el);
              return (produce.indexOf(title) > -1);
            });

            removedItems = customAttributes[removed].split(',').map(el => el.trim()).filter(el => el !== '');

          }
          subRows.push([
            //addressArray.join('\n'),
            SHOP_NAME,
            boxName,
            deliveryDate,
            orderName,
            '', // run id
            firstName,
            lastName,
            addressLine1,
            addressLine2,
            city,
            postcode,
            telephone,
            removedItems.join('\n'),
            addonItems.join('\n'),
            deliveryNote,
            ''
          ]);
        }
      };
      subRows.forEach(row => rows.push(row));
    }
  });
  /*
  const headers = [
    'Address',
    'Box',
    'Delivered',
    'Order',
    'Including',
    'Dislikes',
    'Addons'
  ];
  */
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

  return { headers, rows };
};

export default createCsvRows;

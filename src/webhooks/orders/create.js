const models = require('../../db/models');
const moment = require('moment');
const { LABELKEYS, numberedStringToHandle, listOfToArray, getTotalPrice, getQuantities } = require('./lib');

const orderCreate = async (webhook) => {
  const [delivery_date, p_in, p_add, p_dislikes, subscribed, addprod] = LABELKEYS;

  const payload = webhook.payload;
  console.log('Received Create Order:', payload.line_items.length);

  // a map of the container boxes found in line items
  let box_map = new Map();

  // a map of the box produce found in line items
  let produce_map = new Map();

  // if line item quantity is 2 or more then will be picked up when printing labels
  payload.line_items.forEach(item => {
    var attrs = item.properties.reduce(
      (acc, curr) => Object.assign(acc, { [`${curr.name}`]: curr.value }),
      {});

    console.log('got attributes', JSON.stringify(attrs, null, 2));

    //if (delivery_date in attrs && p_in in attrs && p_add in attrs) {
    if (delivery_date in attrs && p_in in attrs) {
      // XXX we have a container box
      
      /* ProductIds as i, a, d */
      console.log(attrs['ShopID'].split('\n').join(''));
      const base64 = attrs['ShopID'].split('\n').join('');
      const buff2 = Buffer.from(base64, 'base64');
      const res = buff2.toString('utf-8');
      const productIds = JSON.parse(res);
      console.log(productIds);

      const subscription = subscribed in attrs ? attrs[subscribed] : null;
      const delivery = attrs[delivery_date];

      let key = `${delivery}::${item.title}`;
      box_map.set(key, {
        subscription,
        quantity: item.quantity,
        shopify_product_id: item.product_id,
        shopify_variant_id: item.variant_id,
        line_item_id: item.id,
        price: parseInt(parseFloat(item.price) * 100),
        productIds, 
        including: attrs[p_in],
        addons: attrs[p_add],
        dislikes: attrs[p_dislikes],
      });
    };
    if (delivery_date in attrs && addprod in attrs) {
      // we have an add in product
      const delivered = attrs[delivery_date];
      let key = `${delivered}::${attrs[addprod]}`;

      const tempProduct = {
        box_name: attrs[addprod],
        handle: numberedStringToHandle(item.title),
        shopify_variant_id: item.variant_id,
        shopify_product_id: item.product_id,
        price: parseInt(parseFloat(item.price) * 100),
        quantity: item.quantity,
      };
      if (produce_map.has(key)) {
        produce_map.set(key, [tempProduct].concat(produce_map.get(key)));
      } else {
        produce_map.set(key, [tempProduct]);
      }
    };
  });

  const shopify_order_id = payload.id;
  const shopify_title = payload.name;
  const shopify_customer_id = payload.customer.id;
  const total_price = parseInt(parseFloat(payload.total_price) * 100);

  console.log('box_map:', box_map);
  console.log('product_map:', produce_map);
  for (let key of box_map.keys()) {
    let [delivered, box_title] = key.split('::');
    let boxItem = box_map.get(key);
    let productItems = produce_map.has(key) ? produce_map.get(key) : [];

    const shopifyBox = await models.ShopifyBox.findOne({
      where: {
        shopify_variant_id: boxItem.shopify_variant_id,
        shopify_product_id: boxItem.shopify_product_id,
      },
      attributes: ['id'],
    });
    let box;
    let boxId;
    if (!shopifyBox.id) {
      // fail silently
      console.log('Fail. No ShopifyBox found for id:', boxItem.shopify_product_id);
      box = null;
      boxId = null;
    } else {
      console.log('searching for box with', shopifyBox.id, delivered);
      box = await models.Box.findOne({
        where: {
          ShopifyBoxId: shopifyBox.id,
          delivered: moment(delivered, 'ddd MMM DD YYYY'),
        },
        attributes: ['id'],
        include: {
          model: models.ShopifyBox,
          attribute: ['shopify_product_id', 'id'],
        }
      });
      console.log('Found a box', JSON.stringify(box, null, 2));
      boxId = box.id;
    };

    let addOnProducts = listOfToArray(boxItem.addons);

    const [customer, customerCreated] = await models.Customer.findOrCreate({
      where: {
        shopify_customer_id,
      }
    });

    // items should now come from shopID base64 lists
    console.log('addOns', addOnProducts);
    console.log('productItems', productItems);
    if (boxItem.subscription && box) {
      const cart = {
        box_id: boxId,
        delivered,
        including: listOfToArray(boxItem.including),
        addons: addOnProducts,
        dislikes: listOfToArray(boxItem.dislikes),
        shopify_title: box_title,
        shopify_id: boxItem.shopify_product_id,
        subscription: boxItem.subscription,
        total_price: getTotalPrice(productItems.concat(boxItem.addons)),
        quantities: getQuantities(productItems, addOnProducts),
        is_loaded: true,
      };
      console.log('Subscription', boxItem.subscription);
      console.log('Cart: ', cart);
      console.log('The box', box.toJSON());

      const subscriptionType = await models.SubscriptionType.findOne({
        where: {
          ShopifyBoxId: box.ShopifyBoxId,
          title: boxItem.subscription,
        }
      });
      const [subscriber, subscriberCreated] = await models.Subscriber.findOrCreate({
        where: {
          CustomerId: customer.id,
        },
      });
      const [subscription, subscriptionCreated] = await models.Subscription.findOrCreate({
        where: {
          SubscriberId: subscriber.id,
          SubscriptionTypeId: subscriptionType.id,
        },
        defaults: {
          current_cart: cart,
          last_cart: cart,
        },
      });
      console.log('Sub Type', subscriptionType.toJSON());
      console.log('Subscriber', subscriber.toJSON());
      console.log('Subscription', subscription.toJSON());
    };
    console.log('customer', customer.toJSON());
    const order_input = {
      shopify_title: shopify_title,
      shopify_order_id: parseInt(shopify_order_id),
      shopify_line_item_id: parseInt(boxItem.line_item_id),
      BoxId: boxId,
      CustomerId: customer.id,
      SubscriptionId: null, // TODO XXX
    };

    console.log('Inserting order with', order_input);
    const order = await models.Order.create(order_input);

    console.log('The order', JSON.stringify(order, null, 2));
    
  };
}

module.exports = orderCreate;

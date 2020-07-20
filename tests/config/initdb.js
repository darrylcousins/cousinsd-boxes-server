const db = require('../../src/db/models');
const { 
  Box,
  Product,
  BoxProduct,
  Order,
  Subscriber,
  Subscription,
  SubscriptionType,
  ShopifyBox,
} = require('../../src/db/models');

const tearDown = async () => {
  await db.sequelize.drop();
  await db.sequelize.close();
};

const setUp = async () => {
  await db.sequelize.sync({ alter: true });
  await db.sequelize.authenticate();


  // TODO need a better way to insert test data

  const shopifyBox = ShopifyBox.build({
    shopify_product_id: 31792460398333,
  });
  await shopifyBox.save();

  const box = await Box.create({
    shopify_title: "Small Box",
    shopify_gid: "gid://shopify/Product/4502212345333",
    shopify_handle: "small-box",
    shopify_variant_id: 31792460398333,
    shopify_price: 2500,
    delivered: new Date(),
  });

  shopifyBox.addBox(box);

  const productOne = await Product.create({
    shopify_title: "Green Beans",
    shopify_id: 4502212345444,
    shopify_gid: "gid://shopify/Product/4502212345444",
    shopify_handle: "green-beans",
    shopify_variant_id: 31792460398444,
    shopify_price: 450,
    available: true,
  });

  const productTwo = await Product.create({
    shopify_title: "Agria Potato",
    shopify_id: 4502212345914,
    shopify_gid: "gid://shopify/Product/4502212345914",
    shopify_handle: "agria-potato",
    shopify_variant_id: 31792460398650,
    shopify_price: 450,
    available: true,
  });
  await productTwo.addBox(box, { through: { isAddOn: false } });
  await productOne.addBox(box, { through: { isAddOn: true } });


  const subscriptionType = SubscriptionType.build({
    duration: 0,
    frequency: 7,
  });
  await subscriptionType.save();
  shopifyBox.addSubscriptionType(subscriptionType);
  await shopifyBox.save();

  const subscriber = Subscriber.build({
    shopify_customer_id: "4502212345999",
  });
  await subscriber.save();

  const subscription = Subscription.build({
    shopify_product_id: 31792460398333,
    current_cart: {},
    last_cart: {},
  });
  await subscription.save();
  subscription.setSubscriptionType(subscriptionType);
  await subscription.save();
  subscription.setSubscriber(subscriber);
  await subscription.save();

  const order = Order.build({
    shopify_title: "Small Box",
    shopify_order_id: 4502212345333,
    shopify_line_item_id: 31792460398333,
  });
  /* note the save everytime! otherwise we make a new order every time!!! */
  await order.save();
  order.setBox(box)
  await order.save();
  order.setSubscription(subscription)
  await order.save();
  order.setSubscriber(subscriber)
  await order.save();
  shopifyBox.addOrder(order);
  await order.save();

};

module.exports = {
  setUp,
  tearDown,
};

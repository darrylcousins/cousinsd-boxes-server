const { Op } = require("sequelize");
const models = require('../../db/models');
const { UTCDateOnly, dateToISOString, filterFields } = require('../../lib');
const sequelize = require('sequelize');
const parseFields = require('graphql-parse-fields')

const getBoxAttributes = (fields) => {
  return filterFields(fields)
};

const getBoxShopifyBoxInclude = (fields) => {
  if (!fields.shopifyBox) return {};
  const include = {
    model: models.ShopifyBox,
    attributes: filterFields(fields.shopifyBox).filter(el => el !== 'shopify_product_gid'),
    order: [['shopify_title', 'ASC']]
  };
  return include;
};

const getBoxProductInclude = (fields) => {
  if (!fields.products) return {};
  const productFields = filterFields(fields.products).filter(el => el !== 'isAddOn')
    .filter(el => el != 'shopify_gid');
  const include = {
    model: models.Product,
    attributes: productFields,
    through: {
      attributes: ['isAddOn'],
    },
    order: [['shopify_title', 'ASC']]
  };
  return include;
};

const resolvers = {
  Box: {
    async products(instance, args, context, info) {
      return instance.getProducts();
    },
    async addOnProducts(instance, args, context, info) {
      return instance.getAddOnProducts();
    },
    async shopifyBox(instance, args, context, info) {
      return instance.ShopifyBox;
    },
  },
  Query: {
    async getBox(root, { input }, context, info) {
      const fields = parseFields(info);
      // where input can be almost anything
      const include = [];
      if (fields.shopifyBox) include.push(getBoxShopifyBoxInclude(fields));
      if (fields.products) include.push(getBoxProductInclude(fields));
      const box = await models.Box.findOne({
        where: input,
        attributes: getBoxAttributes(fields),
        include,
      });
      return box;
    },
    async getBoxProducts(root, { input }, context, info) {
      const fields = parseFields(info);
      // where input can be almost anything
      const include = [];
      if (fields.shopifyBox) include.push(getBoxShopifyBoxInclude(fields));

      // without product fields it is pretty much useless
      if (fields.products) include.push(getBoxProductInclude(fields));

      const box = await models.Box.findOne({
        where: input,
        attributes: getBoxAttributes(fields),
        include,
        order: [[models.Product, 'shopify_title']],
      });
      return box;
    },
    async getAllBoxes(root, { input }, context, info) {
      const fields = parseFields(info);
      const include = [];
      if (fields.shopifyBox) include.push(getBoxShopifyBoxInclude(fields));
      if (fields.products) include.push(getBoxProductInclude(fields));
      const boxes = await models.Box.findAll({
        attributes: ['id', 'delivered'],
        include,
        //order: [['ShopifyBox.shopify_title', 'ASC']]
      });
      return boxes;
    },
    async getBoxesByDelivered(root, { input }, context, info) {
      // return count, and rows
      let { delivered, limit, offset } = input;
      const fields = parseFields(info);
      //console.log(fields);
      const include = [];
      if (fields.rows.shopifyBox) include.push(getBoxShopifyBoxInclude(fields.rows));
      if (fields.rows.products) include.push(getBoxProductInclude(fields.rows));
      const where = { delivered: {[Op.eq]: delivered} };
      const data = await models.Box.findAndCountAll({
        where,
        limit,
        offset,
        order: [['delivered', 'ASC']],
        distinct: true, // stops the join count on products
        attributes: getBoxAttributes(fields.rows),
        include,
      });

      //console.log(JSON.stringify(data, null, 2));
      return data;
    },
    async getAllBoxesByDelivered(root, { input }, context, info) {
      // return list of boxes
      let { delivered } = input;
      const fields = parseFields(info);
      const include = [];
      if (fields.shopifyBox) include.push(getBoxShopifyBoxInclude(fields));
      if (fields.products) include.push(getBoxProductInclude(fields));
      const where = { delivered: {[Op.eq]: delivered} };
      const data = await models.Box.findAll({
        where,
        order: [['delivered', 'ASC']],
        distinct: true, // stops the join count on products
        attributes: getBoxAttributes(fields),
        include,
      });

      return data;
    },
    async getBoxesByShopifyBox(root, { input }, context, info) {
      // used by client side app
      let { shopify_product_id, limit, offset } = input;
      const fields = parseFields(info);
      const include = [];
      include.push({
        model: models.ShopifyBox,
        where: { shopify_product_id },
        attributes: filterFields(fields.rows.shopifyBox).filter(el => el !== 'shopify_product_gid'),
        order: [['shopify_title', 'ASC']]
      });
      if (fields.rows.products) include.push(getBoxProductInclude(fields.rows));
      const data = await models.Box.findAndCountAll({
        limit,
        offset,
        where: { delivered: { [Op.gt]: new Date().toUTCString() } },
        order: [['delivered', 'ASC']],
        distinct: true, // stops the join count on products
        attributes: getBoxAttributes(fields.rows),
        include,
      });

      return data;
    },
    async getBoxesDeliveredAndCount(root, args, context, info){
      const dates = await models.Box.findAll({
        attributes: ['delivered', [sequelize.fn('count', sequelize.col('id')), 'count']],
        group: ['delivered'],
        order: [['delivered', 'ASC']],
      });
      // coerce from array of Boxes to simple json
      const data = [];
      dates.map((date) => {
          data.push(date.toJSON());
      });
      return data;
    },
  },
  Mutation: {
    async createBox (root, { input }, context, info) {
      /* shopify_product_id, shopify_title, shopify_handle, shopify_price, shopify_variant_id, delivered */
      let { delivered, ...values } = input;

      let shopifyBox = await models.ShopifyBox.findOne({
        where: {shopify_product_id: values.shopify_product_id}
      });

      if (!shopifyBox) {
        shopifyBox = await models.ShopifyBox.create(values);
      };

      const box = await models.Box.create({
        delivered,
        ShopifyBoxId: parseInt(shopifyBox.id),
      });

      // XXX return instance from create does not include associations
      // Box.create(input, { include: ... }) does nothing to help
      // instance.reload({ include: ... }) also does not help at all
      return await models.Box.findByPk(
        box.id,
        { include: [models.Product, models.ShopifyBox] }
      );
    },
    async duplicateBox (root, { input }, context, info) {
      let { id, delivered } = input;

      // where input can be almost anything
      const box = await models.Box.findOne({
        where: { id },
        include: [models.Product],
      });
      const products = box.Products;
      const values = box.toJSON();
      delete values.id;
      values.delivered = UTCDateOnly(delivered);
      delete values.Products;

      const newBox = await models.Box.create(values);

      const bulkValues = products.map(product => (
        { BoxId: newBox.id, ProductId: product.id, isAddOn: product.BoxProduct.isAddOn }
      ));

      models.BoxProduct.bulkCreate(bulkValues);

      return await models.Box.findByPk(
        newBox.id,
        { include: [models.Product, models.ShopifyBox] }
      );

    },
    async updateBox (root, { input }, context, info) {
      const { id, ...props } = input;
      return await models.Box.update(
        props,
        { where: { id } }
      );
    },
    async deleteBox (root, { input }, context, info) {
      /* id */
      const { id } = input;
      const box = await models.Box.findByPk(id);
      box.setProducts([]);
      await models.Box.destroy({ where: { id } });
      return id;
    },
  },
};

module.exports = resolvers;

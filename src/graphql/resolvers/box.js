const { Op } = require("sequelize");
const models = require('../../db/models');
const { UTCDateOnly, dateToISOString, filterFields } = require('../../lib');
const sequelize = require('sequelize');
const parseFields = require('graphql-parse-fields')

const getBoxAttributes = (fields) => {
  return filterFields(fields)
    .filter(el => el != 'shopify_product_id')
    .filter(el => el != 'shopify_product_gid');
};

const getBoxShopifyBoxInclude = (where) => {
  return {
    model: models.ShopifyBox,
    attributes: ['shopify_product_id'],
    where: where,
  };
};

const getBoxProductInclude = (fields) => {
  if (!field.products) return {};
  return {
    model: models.Product,
    attributes: filterFields(fields.products).filter(el => el !== 'isAddOn'),
    through: {
      attributes: ['isAddOn'],
    },
    order: [['shopify_title', 'DESC']]
  };
};

const resolvers = {
  Box: {
    async products(instance, args, context, info) {
      return instance.getProducts();
    },
    async addOnProducts(instance, args, context, info) {
      return instance.getAddOnProducts();
    },
    async shopify_product_id(instance, args, context, info) {
      return instance.getShopifyId();
    },
    async shopify_product_gid(instance, args, context, info) {
      return instance.getShopifyGid();
    },
  },
  Query: {
    async getBox(root, { input }, context, info) {
      const fields = parseFields(info);
      // where input can be almost anything
      const include = [getBoxShopifyBoxInclude()];
      if (fields.product) include.push(getBoxProductInclude(fields));
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
      const include = [getBoxShopifyBoxInclude()];

      // without product fields it is pretty much useless
      if (fields.product) include.push(getBoxProductInclude(fields));
      const box = await models.Box.findOne({
        where: input,
        attributes: getBoxAttributes(fields),
        include,
        order: [['shopify_title', 'DESC']]
      });
      return box;
    },
    async getAllBoxes(root, { input }, context, info) {
      const fields = parseFields(info);
      const include = [getBoxShopifyBoxInclude()];
      if (fields.product) include.push(getBoxProductInclude(fields));
      const boxes = await models.Box.findAll({
        attributes: getBoxAttributes(fields),
        include,
        order: [['shopify_title', 'DESC']]
      });
      return boxes;
    },
    async getBoxesByDelivered(root, { input }, context, info) {
      // return count, and rows
      let { delivered, limit, offset } = input;
      const fields = parseFields(info);
      const include = [getBoxShopifyBoxInclude()];
      if (fields.product) include.push(getBoxProductInclude(fields));
      const where = { delivered: {[Op.eq]: delivered} };
      const data = await models.Box.findAndCountAll({
        where,
        limit,
        offset,
        order: [['delivered', 'ASC']],
        distinct: true, // stops the join count on products
        attributes: getBoxAttributes(fields.rows),
        include,
        order: [['shopify_title', 'ASC']]
      });

      return data;
    },
    async getAllBoxesByDelivered(root, { input }, context, info) {
      // return list of boxes
      let { delivered } = input;
      const fields = parseFields(info);
      const include = [getBoxShopifyBoxInclude()];
      if (fields.product) include.push(getBoxProductInclude(fields));
      const where = { delivered: {[Op.eq]: delivered} };
      const data = await models.Box.findAll({
        where,
        order: [['delivered', 'ASC']],
        distinct: true, // stops the join count on products
        attributes: getBoxAttributes(fields),
        include,
        order: [['shopify_title', 'ASC']]
      });

      return data;
    },
    async getBoxesByShopifyBox(root, { input }, context, info) {
      let { shopify_product_id, limit, offset } = input;
      const fields = parseFields(info);
      const include = [getBoxShopifyBoxInclude()];
      if (fields.product) include.push(getBoxProductInclude(fields));
      const data = await models.Box.findAndCountAll({
        limit,
        offset,
        order: [['delivered', 'ASC']],
        distinct: true, // stops the join count on products
        attributes: getBoxAttributes(fields.rows),
        include,
        order: [['shopify_title', 'DESC']]
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
      const data = []
      dates.map((date) => {
          data.push(date.toJSON())
      })
      return data;
    },
  },
  Mutation: {
    async createBox (root, { input }, context, info) {
      /* shopify_product_id, shopify_title, shopify_handle, shopify_price, shopify_variant_id, delivered */
      let { shopify_product_id, ...data } = input;

      const [shopifyBox, created] = await models.ShopifyBox.findOrCreate({ where: { shopify_product_id } });
      data.ShopifyBoxId = parseInt(shopifyBox.id);
      const box = await models.Box.create(data);

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

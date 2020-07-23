const { Op } = require("sequelize");
const models = require('../../db/models');
const { dateToISOString, filterFields } = require('../../lib');
const sequelize = require('sequelize');
const parseFields = require('graphql-parse-fields')

const getBoxAttributes = (fields) => {
  return filterFields(fields).filter(el => el != 'shopify_product_id');
};

const getBoxShopifyBoxInclude = (where) => {
  return {
    model: models.ShopifyBox,
    attributes: ['shopify_product_id'],
    where: where,
  };
};

const getBoxProductInclude = (fields) => {
  return {
    model: models.Product,
    attributes: filterFields(fields.products).filter(el => el !== 'isAddOn'),
    through: {
      attributes: ['isAddOn'],
    }
  };
};

const resolvers = {
  Box: {
    async products(instance, args, context, info) {
      return instance.Products.filter(product => !product.BoxProduct.isAddOn);
    },
    async addOnProducts(instance, args, context, info) {
      return instance.Products.filter(product => product.BoxProduct.isAddOn);
    },
    async shopify_product_id(instance, args, context, info) {
      return instance.ShopifyBox.shopify_product_id;
    },
    async shopify_product_gid(instance, args, context, info) {
      return`gid://shopify/Product/${instance.shopify_product_id}`;
    },
  },
  Query: {
    async getAllBoxes(root, { input }, context, info) {
      const fields = parseFields(info);
      const boxes = await models.Box.findAll({
        attributes: getBoxAttributes(fields),
        include: [
          getBoxProductInclude(fields),
          getBoxShopifyBoxInclude(),
        ]
      });
      return boxes;
    },
    async getBoxesByDelivered(root, { input }, context, info) {
      let { delivered, limit, offset } = input;
      const fields = parseFields(info);
      const where = { delivered: {[Op.eq]: delivered} };
      const data = await models.Box.findAndCountAll({
        where,
        limit,
        offset,
        order: [['delivered', 'ASC']],
        distinct: true, // stops the join count on products
        attributes: getBoxAttributes(fields.rows),
        include: [
          getBoxProductInclude(fields.rows),
          getBoxShopifyBoxInclude(),
        ]
      });

      return data;
    },
    async getBoxesByShopifyBox(root, { input }, context, info) {
      let { shopify_product_id, limit, offset } = input;
      const fields = parseFields(info);
      const data = await models.Box.findAndCountAll({
        limit,
        offset,
        order: [['delivered', 'ASC']],
        distinct: true, // stops the join count on products
        attributes: getBoxAttributes(fields.rows),
        include: [
          getBoxProductInclude(fields.rows),
          getBoxShopifyBoxInclude({ shopify_product_id }),
        ]
      });

      return data;
    },
    async getBoxDeliveredAndCount(root, args, context, info){
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
      data.ShopifyBoxId = shopifyBox.id;
      const box = await models.Box.create(data);
      // XXX return instance from create does not include associations
      // Box.create(input, { include: ... }) does nothing to help
      // instance.reload({ include: ... }) also does not help at all
      return await models.Box.findByPk(
        box.id,
        {
          include: [models.Product, models.ShopifyBox]
        }
      );
    },
    async updateBox (root, { input }, context, info) {
      /* id, ShopId, shopify_id, shopify_gid, delivered */
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

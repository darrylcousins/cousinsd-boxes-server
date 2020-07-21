const { Op } = require("sequelize");
const { Box, Product } = require('../../db/models');
const { dateToISOString, filterFields } = require('../../lib');
const sequelize = require('sequelize');
const parseFields = require('graphql-parse-fields')

const resolvers = {
  Box: {
    async products(instance, args, context, info) {
      return instance.Products.filter(product => !product.BoxProduct.isAddOn);
    },
    async addOnProducts(instance, args, context, info) {
      return instance.Products.filter(product => product.BoxProduct.isAddOn);
    },
  },
  Query: {
    async getBox(root, { input }, { models }, info){
      const { id } = input;
      const box = await Box.findOne({ 
        where: { id },
      });
      return box;
    },
    async getAllBoxes(root, { input }, { models }, info) {
      const fields = parseFields(info)
      const boxes = await Box.findAll({
        attributes: filterFields(fields),
        include: [
          {
            model: Product,
            attributes: filterFields(fields.products).filter(el => el !== 'isAddOn'),
            through: {
              attributes: ['isAddOn'],
            }
          },
        ]
      });
      return boxes;
    },
    async getBoxes(root, { input }, { models }, info) {
      console.log('HERE');
      let { delivered } = input;
      if (!delivered) delivered = dateToISOString(new Date());
      const boxes = await Box.findAll({
        where: { delivered: {[Op.eq]: delivered} },
        order: [['delivered', 'ASC'], ['shopify_gid', 'ASC']],
      });
      return boxes
    },
    async getCurrentBoxes(root, { input }, { models }, info) {
      // return boxes later than a current date (usually today)
      let { delivered } = input;
      if (!delivered) delivered = dateToISOString(new Date());
      const boxes = await Box.findAll({
        where: { delivered: {[Op.gt]: delivered} },
        order: [['delivered', 'ASC'], ['shopify_gid', 'ASC']],
      });
      return boxes
    },
    async getBoxProducts(root, { input }, { models }, info){
      // graphql includes products
      const { id } = input;
      const box = await Box.findOne({ 
        where: { id },
      });
      return box;
    },
    async getBoxesByShopifyId(root, { input }, { models }, info){
      const { shopify_id } = input;
      const boxes = await Box.findAll({ 
        where: { shopify_id },
        order: [['delivered', 'ASC']],
      });
      return boxes;
    },
    async getBoxDates(root, { input }, { models }, info){
      const dates = await Box.findAll({
        attributes: ['delivered', [sequelize.fn('count', sequelize.col('id')), 'count']],
        group: ['delivered'],
        order: [['delivered', 'ASC']],
      });
      // coerce from array of Orders to simple json
      const data = []
      dates.map((date) => {
          data.push(date.toJSON())
      })
      return data;
    },
  },
  Mutation: {
    async createBox (root, { input }, { models }, info) {
      return Box.create(input);
    },
    async updateBox (root, { input }, { models }, info) {
      const { id, ...props } = input;
      await Box.update(
        props,
        { where: { id } }
      );
      return await Box.findOne({ 
        where: { id },
      });
    },
    async deleteBox (root, { input }, { models }, info) {
      /* id */
      const { id } = input;
      const box = await Box.findByPk(id);
      box.setProducts([]);
      Box.destroy({ where: { id } });
      return id;
    },
  },
};

module.exports = resolvers;

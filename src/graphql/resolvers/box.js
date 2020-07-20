const { Op } = require("sequelize");
const { Box, Product } = require('../../db/models');
const { dateToISOString } = require('../../lib');
const sequelize = require('sequelize');

const resolvers = {
  Box: {
    /*
    async products(instance, args, context, info) {
      const prods = await instance.getProducts({ order: [['title', 'ASC']] });
      return prods.filter(product => !product.BoxProduct.isAddOn);
    },
    async addOnProducts(instance, args, context, info) {
      const prods = await instance.getProducts({ order: [['title', 'ASC']] });
      return prods.filter(product => product.BoxProduct.isAddOn);
    },
    */
  },
  Query: {
    async getBox(root, { input }, { models }, info){
      // graphql does not include products
      const { id } = input;
      const box = await Box.findOne({ 
        where: { id },
      });
      return box;
    },
    async getAllBoxes(root, { input }, { models }, info) {
      const boxes = await Box.findAll({
        include: [
          {
            model: Product,
            as: 'products',
            attributes: [
              'shopify_title',
              'shopify_handle',
            ],
            through: {
              attributes: ['isAddOn'],
            }
          },
        ]
      });
      return boxes;
    },
    async getBoxes(root, { input }, { models }, info) {
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

const { UserInputError } = require("apollo-server-koa");
const { Op } = require("sequelize");
const models = require('../../db/models');

const resolvers = {
  Mutation: {
    async createBoxProducts (root, { input }, context, info) {
      /* boxId, productGids, isAddOn */
      let { productGids, boxId, isAddOn } = input;
      const box = await models.Box.findByPk(boxId);

      const productIds = productGids.map(str => str.split('/')[4]);
      const products = await models.Product.findAll(
        { where: { shopify_id: { [Op.in]: productIds }} }
      );

      // filter out any that are already in boxproducts
      const currentProdIds = await models.BoxProduct.findAll({
        attributes: ['ProductId'],
        where: { BoxId: 11 },
        raw: true,
      }).then((prods) => prods.map(el => el.ProductId));

      try {
        products.forEach(async (product) => {
          if (!currentProdIds.includes(product.id)) {
            var values = { isAddOn, BoxId: boxId, ProductId: product.id };
            await models.BoxProduct.create(values);
          } else {
            console.log('rejecting', product.shopify_title);
          }
        });
        return true;
      } catch(e) {
        throw new UserInputError('Failed to add product to box', {
          invalidArgs: Object.keys(input),
        });
      };
    },
    async removeBoxProduct (root, { input }, context, info) {
      console.log('got this in removeBoxProduct', input);
      /* boxId, productId */
      const { productId, boxId } = input;
      const boxproduct = await models.BoxProduct.findOne(
        { where: { BoxId: boxId, ProductId: productId } }
      );
      console.log('Got this boxproduct', boxproduct.id, boxproduct.BoxId, boxproduct.ProductId);
      try {
        const res = await boxproduct.destroy();
        console.log('Result of destroy:', res);
        return true;
      } catch(e) {
        throw new UserInputError('Failed to remove product to box', {
          invalidArgs: Object.keys(input),
        });
      };
    },
  },
};

module.exports = resolvers;


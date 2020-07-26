'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "Products", deps: []
 * createTable "ShopifyBoxes", deps: []
 * createTable "Subscribers", deps: []
 * createTable "Boxes", deps: [ShopifyBoxes]
 * createTable "BoxProducts", deps: [Boxes, Products]
 * createTable "SubscriptionTypes", deps: [ShopifyBoxes]
 * createTable "Subscriptions", deps: [Subscribers, SubscriptionTypes]
 * createTable "Orders", deps: [Boxes, Subscribers, ShopifyBoxes, Subscriptions]
 * createTable "BoxSubscriptionTypes", deps: [SubscriptionTypes, Boxes]
 *
 **/

var info = {
    "revision": 1,
    "name": "boxes",
    "created": "2020-07-25T01:44:11.657Z",
    "comment": ""
};

var migrationCommands = function(transaction) {
    return [{
            fn: "createTable",
            params: [
                "Products",
                {
                    "id": {
                        "type": Sequelize.INTEGER,
                        "field": "id",
                        "autoIncrement": true,
                        "primaryKey": true,
                        "allowNull": false
                    },
                    "shopify_title": {
                        "type": Sequelize.STRING,
                        "field": "shopify_title"
                    },
                    "shopify_id": {
                        "type": Sequelize.BIGINT,
                        "field": "shopify_id",
                        "allowNull": false
                    },
                    "shopify_handle": {
                        "type": Sequelize.STRING,
                        "field": "shopify_handle"
                    },
                    "shopify_variant_id": {
                        "type": Sequelize.BIGINT,
                        "field": "shopify_variant_id"
                    },
                    "shopify_price": {
                        "type": Sequelize.INTEGER,
                        "field": "shopify_price"
                    },
                    "available": {
                        "type": Sequelize.BOOLEAN,
                        "field": "available",
                        "defaultValue": "0"
                    },
                    "createdAt": {
                        "type": Sequelize.DATE,
                        "field": "createdAt",
                        "allowNull": false
                    },
                    "updatedAt": {
                        "type": Sequelize.DATE,
                        "field": "updatedAt",
                        "allowNull": false
                    }
                },
                {
                    "transaction": transaction
                }
            ]
        },
        {
            fn: "createTable",
            params: [
                "ShopifyBoxes",
                {
                    "id": {
                        "type": Sequelize.INTEGER,
                        "field": "id",
                        "autoIncrement": true,
                        "primaryKey": true,
                        "allowNull": false
                    },
                    "shopify_product_id": {
                        "type": Sequelize.BIGINT,
                        "field": "shopify_product_id",
                        "unique": true,
                        "allowNull": false
                    },
                    "createdAt": {
                        "type": Sequelize.DATE,
                        "field": "createdAt",
                        "allowNull": false
                    },
                    "updatedAt": {
                        "type": Sequelize.DATE,
                        "field": "updatedAt",
                        "allowNull": false
                    }
                },
                {
                    "transaction": transaction
                }
            ]
        },
        {
            fn: "createTable",
            params: [
                "Subscribers",
                {
                    "id": {
                        "type": Sequelize.INTEGER,
                        "field": "id",
                        "autoIncrement": true,
                        "primaryKey": true,
                        "allowNull": false
                    },
                    "shopify_customer_id": {
                        "type": Sequelize.BIGINT,
                        "field": "shopify_customer_id",
                        "unique": true,
                        "allowNull": false
                    },
                    "uid": {
                        "type": Sequelize.UUID,
                        "field": "uid",
                        "unique": true,
                        "allowNull": false,
                        "defaultValue": Sequelize.UUIDV4
                    },
                    "createdAt": {
                        "type": Sequelize.DATE,
                        "field": "createdAt",
                        "allowNull": false
                    },
                    "updatedAt": {
                        "type": Sequelize.DATE,
                        "field": "updatedAt",
                        "allowNull": false
                    }
                },
                {
                    "transaction": transaction
                }
            ]
        },
        {
            fn: "createTable",
            params: [
                "Boxes",
                {
                    "id": {
                        "type": Sequelize.INTEGER,
                        "field": "id",
                        "autoIncrement": true,
                        "primaryKey": true,
                        "allowNull": false
                    },
                    "shopify_handle": {
                        "type": Sequelize.STRING,
                        "field": "shopify_handle",
                        "unique": "compositeIndex"
                    },
                    "shopify_title": {
                        "type": Sequelize.STRING,
                        "field": "shopify_title",
                        "unique": "compositeIndex"
                    },
                    "shopify_variant_id": {
                        "type": Sequelize.BIGINT,
                        "field": "shopify_variant_id",
                        "unique": "compositeIndex"
                    },
                    "shopify_price": {
                        "type": Sequelize.INTEGER,
                        "field": "shopify_price"
                    },
                    "delivered": {
                        "type": Sequelize.DATEONLY,
                        "field": "delivered",
                        "unique": "compositeIndex",
                        "defaultValue": Sequelize.NOW
                    },
                    "createdAt": {
                        "type": Sequelize.DATE,
                        "field": "createdAt",
                        "allowNull": false
                    },
                    "updatedAt": {
                        "type": Sequelize.DATE,
                        "field": "updatedAt",
                        "allowNull": false
                    },
                    "ShopifyBoxId": {
                        "type": Sequelize.INTEGER,
                        "field": "ShopifyBoxId",
                        "onUpdate": "CASCADE",
                        "onDelete": "SET NULL",
                        "references": {
                            "model": "ShopifyBoxes",
                            "key": "id"
                        },
                        "allowNull": true
                    }
                },
                {
                    "transaction": transaction
                }
            ]
        },
        {
            fn: "createTable",
            params: [
                "BoxProducts",
                {
                    "id": {
                        "type": Sequelize.INTEGER,
                        "field": "id",
                        "allowNull": false,
                        "autoIncrement": true,
                        "primaryKey": true
                    },
                    "isAddOn": {
                        "type": Sequelize.BOOLEAN,
                        "field": "isAddOn",
                        "defaultValue": "0"
                    },
                    "BoxId": {
                        "type": Sequelize.INTEGER,
                        "unique": "BoxProducts_ProductId_BoxId_unique",
                        "references": {
                            "model": "Boxes",
                            "key": "id"
                        },
                        "onDelete": "CASCADE",
                        "onUpdate": "CASCADE",
                        "field": "BoxId",
                        "allowNull": true
                    },
                    "ProductId": {
                        "type": Sequelize.INTEGER,
                        "unique": "BoxProducts_ProductId_BoxId_unique",
                        "references": {
                            "model": "Products",
                            "key": "id"
                        },
                        "onDelete": "CASCADE",
                        "onUpdate": "CASCADE",
                        "field": "ProductId",
                        "allowNull": true
                    },
                    "createdAt": {
                        "type": Sequelize.DATE,
                        "field": "createdAt",
                        "allowNull": false
                    },
                    "updatedAt": {
                        "type": Sequelize.DATE,
                        "field": "updatedAt",
                        "allowNull": false
                    }
                },
                {
                    "transaction": transaction
                }
            ]
        },
        {
            fn: "createTable",
            params: [
                "SubscriptionTypes",
                {
                    "id": {
                        "type": Sequelize.INTEGER,
                        "field": "id",
                        "autoIncrement": true,
                        "primaryKey": true,
                        "allowNull": false
                    },
                    "duration": {
                        "type": Sequelize.INTEGER,
                        "field": "duration"
                    },
                    "frequency": {
                        "type": Sequelize.INTEGER,
                        "field": "frequency"
                    },
                    "createdAt": {
                        "type": Sequelize.DATE,
                        "field": "createdAt",
                        "allowNull": false
                    },
                    "updatedAt": {
                        "type": Sequelize.DATE,
                        "field": "updatedAt",
                        "allowNull": false
                    },
                    "ShopifyBoxId": {
                        "type": Sequelize.INTEGER,
                        "field": "ShopifyBoxId",
                        "onUpdate": "CASCADE",
                        "onDelete": "SET NULL",
                        "references": {
                            "model": "ShopifyBoxes",
                            "key": "id"
                        },
                        "allowNull": true
                    }
                },
                {
                    "transaction": transaction
                }
            ]
        },
        {
            fn: "createTable",
            params: [
                "Subscriptions",
                {
                    "id": {
                        "type": Sequelize.INTEGER,
                        "field": "id",
                        "autoIncrement": true,
                        "primaryKey": true,
                        "allowNull": false
                    },
                    "uid": {
                        "type": Sequelize.UUID,
                        "field": "uid",
                        "unique": true,
                        "allowNull": false,
                        "defaultValue": Sequelize.UUIDV4
                    },
                    "current_cart": {
                        "type": Sequelize.JSONB,
                        "field": "current_cart"
                    },
                    "last_cart": {
                        "type": Sequelize.JSONB,
                        "field": "last_cart"
                    },
                    "createdAt": {
                        "type": Sequelize.DATE,
                        "field": "createdAt",
                        "allowNull": false
                    },
                    "updatedAt": {
                        "type": Sequelize.DATE,
                        "field": "updatedAt",
                        "allowNull": false
                    },
                    "SubscriberId": {
                        "type": Sequelize.INTEGER,
                        "field": "SubscriberId",
                        "onUpdate": "CASCADE",
                        "onDelete": "SET NULL",
                        "references": {
                            "model": "Subscribers",
                            "key": "id"
                        },
                        "allowNull": true
                    },
                    "SubscriptionTypeId": {
                        "type": Sequelize.INTEGER,
                        "field": "SubscriptionTypeId",
                        "onUpdate": "CASCADE",
                        "onDelete": "SET NULL",
                        "references": {
                            "model": "SubscriptionTypes",
                            "key": "id"
                        },
                        "allowNull": true
                    }
                },
                {
                    "transaction": transaction
                }
            ]
        },
        {
            fn: "createTable",
            params: [
                "Orders",
                {
                    "id": {
                        "type": Sequelize.INTEGER,
                        "field": "id",
                        "autoIncrement": true,
                        "primaryKey": true,
                        "allowNull": false
                    },
                    "shopify_title": {
                        "type": Sequelize.STRING,
                        "field": "shopify_title"
                    },
                    "shopify_order_id": {
                        "type": Sequelize.BIGINT,
                        "field": "shopify_order_id"
                    },
                    "shopify_line_item_id": {
                        "type": Sequelize.BIGINT,
                        "field": "shopify_line_item_id"
                    },
                    "createdAt": {
                        "type": Sequelize.DATE,
                        "field": "createdAt",
                        "allowNull": false
                    },
                    "updatedAt": {
                        "type": Sequelize.DATE,
                        "field": "updatedAt",
                        "allowNull": false
                    },
                    "BoxId": {
                        "type": Sequelize.INTEGER,
                        "field": "BoxId",
                        "onUpdate": "CASCADE",
                        "onDelete": "SET NULL",
                        "references": {
                            "model": "Boxes",
                            "key": "id"
                        },
                        "allowNull": true
                    },
                    "SubscriberId": {
                        "type": Sequelize.INTEGER,
                        "field": "SubscriberId",
                        "onUpdate": "CASCADE",
                        "onDelete": "SET NULL",
                        "references": {
                            "model": "Subscribers",
                            "key": "id"
                        },
                        "allowNull": true
                    },
                    "ShopifyBoxId": {
                        "type": Sequelize.INTEGER,
                        "field": "ShopifyBoxId",
                        "onUpdate": "CASCADE",
                        "onDelete": "SET NULL",
                        "references": {
                            "model": "ShopifyBoxes",
                            "key": "id"
                        },
                        "allowNull": true
                    },
                    "SubscriptionId": {
                        "type": Sequelize.INTEGER,
                        "field": "SubscriptionId",
                        "onUpdate": "CASCADE",
                        "onDelete": "SET NULL",
                        "references": {
                            "model": "Subscriptions",
                            "key": "id"
                        },
                        "allowNull": true
                    }
                },
                {
                    "transaction": transaction
                }
            ]
        },
        {
            fn: "createTable",
            params: [
                "BoxSubscriptionTypes",
                {
                    "createdAt": {
                        "type": Sequelize.DATE,
                        "field": "createdAt",
                        "allowNull": false
                    },
                    "updatedAt": {
                        "type": Sequelize.DATE,
                        "field": "updatedAt",
                        "allowNull": false
                    },
                    "SubscriptionTypeId": {
                        "type": Sequelize.INTEGER,
                        "field": "SubscriptionTypeId",
                        "onUpdate": "CASCADE",
                        "onDelete": "CASCADE",
                        "references": {
                            "model": "SubscriptionTypes",
                            "key": "id"
                        },
                        "primaryKey": true
                    },
                    "BoxId": {
                        "type": Sequelize.INTEGER,
                        "field": "BoxId",
                        "onUpdate": "CASCADE",
                        "onDelete": "CASCADE",
                        "references": {
                            "model": "Boxes",
                            "key": "id"
                        },
                        "primaryKey": true
                    }
                },
                {
                    "transaction": transaction
                }
            ]
        }
    ];
};
var rollbackCommands = function(transaction) {
    return [{
            fn: "dropTable",
            params: ["Boxes", {
                transaction: transaction
            }]
        },
        {
            fn: "dropTable",
            params: ["BoxProducts", {
                transaction: transaction
            }]
        },
        {
            fn: "dropTable",
            params: ["Orders", {
                transaction: transaction
            }]
        },
        {
            fn: "dropTable",
            params: ["Products", {
                transaction: transaction
            }]
        },
        {
            fn: "dropTable",
            params: ["ShopifyBoxes", {
                transaction: transaction
            }]
        },
        {
            fn: "dropTable",
            params: ["Subscribers", {
                transaction: transaction
            }]
        },
        {
            fn: "dropTable",
            params: ["Subscriptions", {
                transaction: transaction
            }]
        },
        {
            fn: "dropTable",
            params: ["SubscriptionTypes", {
                transaction: transaction
            }]
        },
        {
            fn: "dropTable",
            params: ["BoxSubscriptionTypes", {
                transaction: transaction
            }]
        }
    ];
};

module.exports = {
    pos: 0,
    useTransaction: true,
    execute: function(queryInterface, Sequelize, _commands)
    {
        var index = this.pos;
        function run(transaction) {
            const commands = _commands(transaction);
            return new Promise(function(resolve, reject) {
                function next() {
                    if (index < commands.length)
                    {
                        let command = commands[index];
                        console.log("[#"+index+"] execute: " + command.fn);
                        index++;
                        queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                    }
                    else
                        resolve();
                }
                next();
            });
        }
        if (this.useTransaction) {
            return queryInterface.sequelize.transaction(run);
        } else {
            return run(null);
        }
    },
    up: function(queryInterface, Sequelize)
    {
        return this.execute(queryInterface, Sequelize, migrationCommands);
    },
    down: function(queryInterface, Sequelize)
    {
        return this.execute(queryInterface, Sequelize, rollbackCommands);
    },
    info: info
};

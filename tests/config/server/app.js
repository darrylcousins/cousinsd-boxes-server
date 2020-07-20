const  { ApolloServer } = require('apollo-server');
const  { gql } = require('@apollo/client');
const { merge } = require('lodash');
const resolvers = require('../../../src/graphql/resolvers');
const typeDefs = require('../../../src/graphql/typedefs');

const server = new ApolloServer({ 
  typeDefs, 
  resolvers,
});

module.exports = server;

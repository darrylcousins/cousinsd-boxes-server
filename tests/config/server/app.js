const  { ApolloServer } = require('apollo-server');
const resolvers = require('../../../src/graphql/resolvers');
const typeDefs = require('../../../src/graphql/typedefs');

const server = new ApolloServer({ 
  typeDefs, 
  resolvers,
});

module.exports = server;

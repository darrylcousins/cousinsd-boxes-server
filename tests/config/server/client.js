const { ApolloClient, HttpLink, InMemoryCache } = require('@apollo/client');
const fetch = require('isomorphic-fetch');

const cache = new InMemoryCache({
  dataIdFromObject: object => `${object.__typename}:${object.id}`,
});

const link = new HttpLink({
  uri: 'http://localhost:4000/',
  fetch,
});

const client = new ApolloClient({
  link,
  cache,
  onError: (error) => console.log('Error here', JSON.stringify(error, null, 2))
});

module.exports = client;

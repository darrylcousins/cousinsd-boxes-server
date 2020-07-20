const { ApolloClient, HttpLink, InMemoryCache } = require('@apollo/client');
const fetch = require('isomorphic-fetch');

const cache = new InMemoryCache({
  dataIdFromObject: object => object.id,
});

const link = new HttpLink({
  uri: 'http://localhost:4000/',
  fetch,
});

const client = new ApolloClient({
  link,
  cache,
  onError: (e) => { console.log(e) },
});

module.exports = client;


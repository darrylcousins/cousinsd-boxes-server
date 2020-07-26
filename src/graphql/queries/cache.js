const { gql } = require('@apollo/client');

const CacheQueries = {
  getSelectedDate: gql`
    query selectedDate {
      selectedDate @client
    }
  `,
};

module.exports = {
  CacheQueries,
};

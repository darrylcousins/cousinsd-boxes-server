import React from 'react';
import {
  Banner,
  DataTable,
  EmptyState,
  Loading,
} from '@shopify/polaris';
import { Query } from '@apollo/react-components';
import LoadingPageMarkup from '../common/LoadingPageMarkup';
//import Customer from './Customer';
//import Subscriptions from './Subscriptions';
import { SubscriptionTypeQueries } from '../../graphql/queries';

export default function SubscriptionTypeList() {

  const input = { shopify_product_id: null };
  return (
    <Query
      query={SubscriptionTypeQueries.getSubscriptionTypes}
      fetchPolicy='no-cache'
      variables={ { input } }
    >
      {({ loading, error, data }) => {
        const isError = error && (
          <Banner status="critical">{error.message}</Banner>
        );
        const isLoading = loading && (
          <React.Fragment>
            <Loading />
            <LoadingPageMarkup />
          </React.Fragment>
        );
        console.log(JSON.stringify(data, null, 2));
        /* datatable stuff */
        const rows = isLoading ? Array(2) : data.getSubscriptionTypes.map((subscriptionType) => (
          [
            <div>{ subscriptionType.title }</div>,
            <div>{ subscriptionType.description }</div>,
            <div>{ subscriptionType.frequency }</div>,
            <div>{ subscriptionType.duration }</div>,
            <div>{ subscriptionType.discount }</div>,
            <div>{ subscriptionType.shopify_box_id }</div>,
          ]
        ));
        /* end datatable stuff */

        return (
          <React.Fragment>
            { isError && isError } 
            { isLoading ? isLoading :
              <DataTable
                columnContentTypes={Array(2).fill('text')}
                headings={[
                  <strong key={1}>Title</strong>,
                  <strong key={1}>Description</strong>,
                  <strong key={1}>Frequency</strong>,
                  <strong key={1}>Duration</strong>,
                  <strong key={1}>Discount</strong>,
                  <strong key={1}>Box</strong>,
                ]}
                rows={rows}
              />
            }
            { data && data.getSubscriptionTypes.length == 0 &&
              <EmptyState
                heading="No subscription types"
                secondaryAction={{content: 'Learn more', url: 'http://cousinsd.net/'}}
              >
              </EmptyState>
            }
          </React.Fragment>
        );
      }}
    </Query>
  );
};


import React from 'react';
import {
  Banner,
  Button,
  DataTable,
  EmptyState,
  Layout,
  Loading,
} from '@shopify/polaris';
import { Query } from '@apollo/react-components';
import { Redirect } from "@shopify/app-bridge/actions";
import { Context } from '@shopify/app-bridge-react'
import { numberFormat } from '../../lib';
import LoadingPageMarkup from '../common/LoadingPageMarkup';
import Editable from '../common/Editable';
import Switch from '../common/Switch';
import { ProductQueries, ProductMutations, ShopifyMutations } from '../../graphql/queries';

export default function ProductList() {

  return (
    <Query
      query={ProductQueries.getAllProducts}
      fetchPolicy='no-cache'
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

        /* datatable stuff */
        console.log(data);
        const rows = (isLoading || !data) ? Array(3) : data.getAllProducts.map((product) => (
          [
            <Editable 
              key={0}
              title={product.shopify_title}
              context={ { shopify: true } }
              id={product.shopify_gid}
              fieldName='title'
              mutation={ShopifyMutations.productUpdate}
              update={(data) => null}
              textStyle='strong'
            />,
            <Context.Consumer>
              { app => {
                const redirect = Redirect.create(app);
                return (
                  <Button 
                    plain
                    external
                    onClick={() => redirect.dispatch(
                      Redirect.Action.ADMIN_PATH,
                      { path: `/products/${product.shopify_id}`, newContext: true }
                    )}
                  >
                    View in store
                  </Button>
                );
              }}
              </Context.Consumer>,
            <Switch
              key={1}
              id={product.id}
              fieldName='available'
              context={ { shopify: false } }
              mutation={ProductMutations.toggleProductAvailable}
              update={(data) => console.log(data)}
              selected={product.available}
              onChange={(checked, id) => null}
            />,
            <span>{ numberFormat({ amount: product.shopify_price, currencyCode: 'NZD' }) }</span>,
          ]
        ));
        /* end datatable stuff */

        return (
          <React.Fragment>
            { isError && isError } 
            { isLoading ? isLoading :
              <DataTable
                columnContentTypes={Array(2).fill('text').concat(['number'])}
                headings={[
                  <strong key={0}>Title</strong>,
                  <strong key={1}>View in store</strong>,
                  <strong key={2}>Available</strong>,
                  <strong key={3}>Price</strong>,
                ]}
                rows={rows}
              />
            }
            { data && data.getAllProducts.length == 0 &&
              <Layout>
                <Layout.Section>
                  <EmptyState
                    heading="Manage your veggie box produce"
                    secondaryAction={{content: 'Learn more', url: 'http://cousinsd.net/'}}
                  >
                      <p style={{ textAlign: 'left' }}>
                        Add products on your store, be sure to set<br />
                        <strong>Product Type</strong> as <strong>&quot;Box Produce&quot;</strong>,<br />
                        <strong>Vendor</strong> as <strong>&quot;Spring Collective&quot;</strong>
                      </p>
                  </EmptyState>
                </Layout.Section>
              </Layout>
            }
          </React.Fragment>
        );
      }}
    </Query>
  );
}

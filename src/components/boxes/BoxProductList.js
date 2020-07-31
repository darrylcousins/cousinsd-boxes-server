import React, { useState, useCallback } from 'react';
import {
  Banner,
  Button,
  Collapsible,
  Loading,
  Spinner,
  Stack,
  TextStyle,
} from '@shopify/polaris';
import { Query } from '@apollo/react-components';
import BoxProductAdd from './BoxProductAdd';
import BoxProductRemove from './BoxProductRemove';
import { BoxQueries } from '../../graphql/queries';

export default function BoxProductList({ id, isAddOn }) {

  const input = { id };
  const [showProducts, setShowProducts] = useState(false);
  const toggleShowProducts = useCallback(() => setShowProducts(!showProducts), [showProducts]);

  return (
    <Query
      query={BoxQueries.getBoxProducts}
      variables={{ input }}
      fetchPolicy='no-cache'
    >
      {({ loading, error, data, refetch }) => {
        if (loading) { 
          return (
            <React.Fragment>
              <Loading />
              <Spinner size='small' />
            </React.Fragment>
          );
        }
        if (error) { return (
          <Banner status="critical">{error.message}</Banner>
        )}
        //console.log(JSON.stringify(data, null, 2));
        const products = isAddOn ? data.getBoxProducts.addOnProducts : data.getBoxProducts.products;
        const doRefetch = () => refetch({ input });
        return (
            <Stack>
            { products.length ? 
              <Stack vertical>
                <Button 
                  plain
                  onClick={toggleShowProducts}
                  ariaExpanded={showProducts}
                  ariaControls="product-collapsible"
                  disclosure={!showProducts ? 'down' : 'up'}
                >
                  <TextStyle variation='subdued'>
                    { isAddOn ? 'Add ons' : 'Included' }
                  </TextStyle>
                </Button>
                  <Collapsible
                    open={showProducts}
                    id="product-collapsible"
                    transition={{duration: '150ms', timingFuntion: 'ease'}}
                  >
                    { products.map(product => (
                      <Stack 
                        vertical
                        key={product.id}>
                        <BoxProductRemove
                          isAddOn={isAddOn}
                          product={product}
                          boxId={ parseInt(id) }
                          refetch={doRefetch} />
                      </Stack>
                    )) }
                  </Collapsible>
              </Stack>
              : <TextStyle variation="subdued">No products</TextStyle>
            }
              <BoxProductAdd
                boxId={ parseInt(id) }
                refetch={doRefetch}
                isAddOn={isAddOn} />
            </Stack>
        )
      }}
    </Query>
  );
}




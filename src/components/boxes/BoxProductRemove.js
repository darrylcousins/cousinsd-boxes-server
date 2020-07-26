import React from 'react';
import {
  Banner,
  Button,
  Icon,
  Loading,
  Spinner,
  Stack,
  TextStyle,
} from '@shopify/polaris';
import {
  CircleMinusOutlineMinor,
} from '@shopify/polaris-icons';
import { Mutation } from '@apollo/react-components';
import { BoxProductMutations } from '../../graphql/queries';

/*
 * Remove a product from a box with id
 */

export default function BoxProductRemove({ boxId, product, refetch }) {

  return (
    <Mutation
      mutation={BoxProductMutations.removeBoxProduct}
    >
      {(productRemove, { loading, error }) => {
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

        const handleProductRemove = () => {
          const productId = parseInt(product.id);
          const input = { boxId, productId };
          productRemove({ variables: { input } })
            .then(() => {
              refetch();
          }).catch((error) => {
            console.log('error', error);
          });
        };

        const textStyle = product.available === true ? 'strong' : 'subdued';

        return (
          <Stack>
            <Button
              plain
              onClick={handleProductRemove}>
                <Icon source={CircleMinusOutlineMinor} />
            </Button>
            <TextStyle variation={textStyle}>
              {product.shopify_title}
            </TextStyle>
          </Stack>
        );
      }}
    </Mutation>
  );
}

import React, { useState } from 'react';
import {
  Banner,
  Button,
  ButtonGroup,
  Loading,
  Stack,
} from '@shopify/polaris';
import { Mutation } from '@apollo/react-components';
import { useQuery } from '@apollo/client';
import { dateOnly } from '../../lib';
import BoxAddSelectDate from './BoxAddSelectDate';
import BoxAddSelectName from './BoxAddSelectName';
import BoxAddSelectProduct from './BoxAddSelectProduct';
import { CacheQueries, BoxMutations } from '../../graphql/queries';

export default function BoxAdd({ onComplete, refetch }) {

  const { data } = useQuery(CacheQueries.getSelectedDate);
  const [storeProduct, setStoreProduct] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date(data.selectedDate));
  const [name, setName] = useState('');

  return (
    <Mutation
      mutation={BoxMutations.createBox}
    >
      {(boxAdd, { loading, error, data }) => {
        if (loading) { return <Loading />; }

        const isError = error && (
          <Banner status="critical">{error.message}</Banner>
        );

        const handleBoxAdd = () => {
          console.log('got this date', selectedDate);
          console.log('got this date to add', dateOnly(selectedDate));
          const variables = {
            input: {
              delivered: dateOnly(selectedDate),
              shopify_title: storeProduct.title,
              shopify_product_id: parseInt(storeProduct.id.split('/')[4]),
              shopify_handle: storeProduct.handle,
              shopify_variant_id: parseInt(storeProduct.variants[0].id.split('/')[4]),
              shopify_price: parseInt(parseFloat(storeProduct.variants[0].price)*100),
            }
          };
          boxAdd({ variables })
            .then(() => {
              onComplete();
              refetch();
            })
            .catch((error) => {
              console.log('error', error);
          });
        }

        return (
          <Stack vertical>
            { isError && isError } 
            <BoxAddSelectProduct product={storeProduct} onSelect={setStoreProduct} />
            <BoxAddSelectDate date={selectedDate} onSelect={setSelectedDate} />
            <ButtonGroup
              segmented
              fullWidth
            >
              <Button
                primary
                onClick={handleBoxAdd}
              >
                Save
              </Button>
              <Button
                onClick={onComplete}
              >
                Cancel
              </Button>
            </ButtonGroup>
          </Stack>
        );
      }}
    </Mutation>
  );
}

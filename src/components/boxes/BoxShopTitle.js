import React, {useState, useCallback} from 'react';
import {
  Button,
  InlineError,
  Loading,
  Spinner,
  TextStyle,
} from '@shopify/polaris';
import { ResourcePicker } from '@shopify/app-bridge-react';
import { Mutation } from '@apollo/react-components';
import { findErrorMessage } from '../../lib';
import { BoxMutations } from '../../graphql/queries';

export default function BoxShopTitle({ id, title }) {

  const [value, setValue] = useState(title);
  const [pickerActive, setPickerActive] = useState(false);

  const handleResourcePickerClose = useCallback(() => setPickerActive(false), []);
  const toggleResourcePicker = useCallback(() => setPickerActive(!pickerActive), [pickerActive]);

  return (
    <Mutation
      mutation={BoxMutations.updateBox}
    >
      {(handleUpdate, { loading, error }) => {
        if (loading) { 
          return (
            <React.Fragment>
              <Loading />
              <Spinner size='small' />
            </React.Fragment>
          );
        }
        const isError = error && (
          <InlineError message={ findErrorMessage(error) }  />
        );

        const handleResourceSelection = ({ selection }) => {
          handleResourcePickerClose();
          const storeProduct = selection[0];
          const input = { 
            id: parseInt(id),
            //shopify_gid: storeProduct.id,
            shopify_title: storeProduct.title,
            shopify_handle: storeProduct.handle,
            shopify_product_id: parseInt(storeProduct.id.split('/')[4]),
            shopify_variant_id: storeProduct.variants[0].id.split('/')[4],
            shopify_price: parseInt(parseFloat(storeProduct.price * 100)),
          };
          console.log(JSON.stringify(input, null, 2));
          /*
          handleUpdate({ variables: { input } })
            .then(() => {
              setValue(storeProduct.title);
            })
            */
        };

        return (
          <React.Fragment>
            <Button
              plain
              onClick={toggleResourcePicker}
              disclosure={!pickerActive ? 'down' : 'up'}
            >
              <TextStyle variation="subdued">{value}</TextStyle>
            </Button>
            { isError && isError } 
            <ResourcePicker
              resourceType="Product"
              open={pickerActive}
              initialQuery='Veg'
              allowMultiple={false}
              showHidden={false}
              onSelection={handleResourceSelection}
              onCancel={handleResourcePickerClose}
            />
          </React.Fragment>
        );
      }}
    </Mutation>
  );

  }



import React, {useState, useCallback} from 'react';
import {
  Banner,
  Button,
  Icon,
  Loading,
  Spinner,
  TextStyle,
} from '@shopify/polaris';
import {
  CirclePlusOutlineMinor
} from '@shopify/polaris-icons';
import { ResourcePicker } from '@shopify/app-bridge-react';
import { Mutation } from '@apollo/react-components';
import { BoxProductMutations } from '../../graphql/queries';

/*
 * Add product to a box
*/
export default function BoxProductAdd({ boxId, isAddOn, refetch }) {

  const [pickerActive, setPickerActive] = useState(false);

  const handleResourcePickerClose = useCallback(() => setPickerActive(false), []);
  const toggleResourcePicker = useCallback(() => setPickerActive(!pickerActive), [pickerActive]);

  return (
    <Mutation
      mutation={BoxProductMutations.createBoxProducts}
      fetchPolicy='no-cache'
    >
      {(handleAdd, { loading, error }) => {
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

        const handleResourceSelection = ({ selection }) => {
          handleResourcePickerClose();
          const productGids = selection
            .filter((item) => item.productType == 'Box Produce')
            .map((item) => item.id);
          const input = {
            boxId,
            productGids,
            isAddOn
          };
          handleAdd({ variables: { input } })
            .then(() => {
              refetch();
          }).catch((error) => {
            console.log('error', error);
          });
        };

        return (
          <React.Fragment>
            <Button
              plain
              onClick={toggleResourcePicker}
            >
              <TextStyle variation="subdued">
                <Icon 
                  color='inkLightest'
                  source={CirclePlusOutlineMinor} />
              </TextStyle>
            </Button>
            <ResourcePicker
              resourceType="Product"
              open={pickerActive}
              initialQuery='product_type:"Box Produce"'
              allowMultiple={true}
              showHidden={true}
              onSelection={handleResourceSelection}
              onCancel={handleResourcePickerClose}
            />
          </React.Fragment>
        );
      }}
    </Mutation>
  );
}


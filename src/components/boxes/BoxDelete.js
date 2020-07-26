import React, { useEffect, useState, useCallback } from 'react';
import {
  Banner,
  Loading,
  Modal,
  Spinner,
  TextContainer,
} from '@shopify/polaris';
import { Mutation } from '@apollo/react-components';
import { BoxMutations } from '../../graphql/queries';

export default function BoxDelete({ open, box, onComplete, onCancel }) {

  /* modal stuff */
  const [modalOpen, setModalOpen] = useState(open);
  const [instance, setInstance] = useState(box);

  useEffect(() => {
    setModalOpen(open);
    setInstance(box);
  }, [open, box])

  const toggleModalOpen = useCallback(() => setModalOpen(!modalOpen), [modalOpen]);
  /* end modal stuff */

  return (
    <Mutation
      mutation={BoxMutations.deleteBox}
    >
      {(boxDelete, { loading, error }) => {
        const isError = error && (
          <Banner status="critical">{error.message}</Banner>
        );
        const isLoading = loading && (
          <React.Fragment>
            <Loading />
            <Spinner />
          </React.Fragment>
        );

        const deleteBox = () => {
          const input = { id: instance.id }
          boxDelete({ variables: { input } })
            .then(() => {
              onComplete();
          }).catch((error) => {
            console.log('error', error);
          });
        }

        return (
          <Modal
            open={modalOpen}
            onClose={toggleModalOpen}
            title={`Are you sure you want to delete ${instance.shopify_title}?`}
            primaryAction={{
              content: "Yes, I'm sure",
              onAction: deleteBox,
              destructive: true,
            }}
            secondaryActions={[
              {
                content: 'Cancel',
                onAction: onCancel,
              },
            ]}
          >
            <Modal.Section>
              { isError && isError } 
              { isLoading ? isLoading :
                <TextContainer>
                  <p>
                    Deleting box.  { instance.id }
                    This action cannot be undone.
                  </p>
                </TextContainer>
              }
            </Modal.Section>
          </Modal>
        );
      }}
    </Mutation>
  );
}

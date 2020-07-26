import React, { useEffect, useState, useCallback } from 'react';
import {
  Banner,
  Button,
  ButtonGroup,
  Loading,
  Stack,
  Sheet,
  TextStyle,
} from '@shopify/polaris';
import { Mutation } from '@apollo/react-components';
import { execute } from '@apollo/client';
import { LocalHttpLink } from '../../graphql/client';
import { dateOnly } from '../../lib';
import SheetHelper from '../common/SheetHelper';
import BoxAddSelectDate from './BoxAddSelectDate';
import { BoxMutations } from '../../graphql/queries';

export default function BoxDuplicate({ open, box, onComplete, onCancel }) {

  const [instance, setInstance] = useState(box);
  const [selectedDate, setSelectedDate] = useState(new Date(box.delivered));

  const [sheetOpen, setSheetOpen] = useState(open);
  const toggleSheetOpen = useCallback(() => setSheetOpen(!sheetOpen), [sheetOpen]);

  const [duplicateLoading, setDuplicateLoading] = useState(false);

  const [dateError, setDateError] = useState(false);
  //const [dateMessage, setDateMessage] = useState(true);
  const dateMessage = true; // eslint

  useEffect(() => {
    setInstance(box);
    setSheetOpen(open);
  }, [open, box]);

  return (
    <Sheet open={sheetOpen} onClose={onCancel}>
      <SheetHelper title={`Duplicate Box`} toggle={toggleSheetOpen}>
        <Mutation
          mutation={BoxMutations.duplicateBox}
        >
          {(boxDuplicate, { loading, error, data }) => {
            if (loading) { return <Loading />; }
            const isError = error && (
              <Banner status="critical">{error.message}</Banner>
            );

            const handleBoxDuplicate = (e) => {
              setDuplicateLoading(true);
              if (selectedDate.getTime() == parseInt(instance.delivered)) {
                setDateError(true);
                setDuplicateLoading(false);
                e.stopPropagation();
                return false;
              }
              const variables = {
                input: {
                  delivered: dateOnly(selectedDate),
                  id: instance.id,
                }
              };
              boxDuplicate({ variables }).then((value) => {
                onComplete();
              }).catch((error) => {
                console.log('error', error);
              });
              e.stopPropagation();
            }

            return (
              <Stack vertical>
                <TextStyle variation="subdued"><i>{ instance.shopify_title }</i></TextStyle>
                { dateMessage && (
                  <Banner status="info">Please select a new date</Banner>
                )} 
                { isError && isError } 
                { dateError && (
                  <Banner status="critical">Duplicated box cannot have same delivery date!</Banner>
                )} 
                <BoxAddSelectDate date={selectedDate} onSelect={setSelectedDate} />
                <ButtonGroup
                  segmented
                  fullWidth
                >
                  <Button
                    primary
                    loading={duplicateLoading}
                    onClick={handleBoxDuplicate}
                  >
                    Duplicate
                  </Button>
                  <Button
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                </ButtonGroup>
              </Stack>
            );
          }}
        </Mutation>
      </SheetHelper>
    </Sheet>
  );
}


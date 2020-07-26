import React, { useEffect, useState, useCallback } from 'react';
import {
  ActionList,
  Badge,
  Button,
  Popover,
} from '@shopify/polaris';
import { useQuery, useApolloClient } from '@apollo/client';
import { CacheQueries } from '../../graphql/queries';

export default function DateSelector({ handleDateChange, disabled, dates }) {

  const [popoverActive, setPopoverActive] = useState(false);
  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    [],
  );

  const { data } = useQuery(CacheQueries.getSelectedDate);
  const [delivered, setDelivered] = useState(data.selectedDate);
  const client = useApolloClient();

  const [selectedDate, setSelectedDate] = useState(new Date(delivered));

  const setSelectedDateChange = (date) => {
    console.log('selected date', date);
    console.log('selected date toDateString', date.toDateString());

    setSelectedDate(date);
    const dateString = date.toDateString();
    setDelivered(dateString);
    client.writeQuery({
      query: CacheQueries.getSelectedDate,
      data: {
        selectedDate: dateString,
      }
    });
    togglePopoverActive();
    handleDateChange(dateString);
  }

  useEffect(() => {
  }, []);


  return (
    <Popover fluidContent={true} active={popoverActive} onClose={togglePopoverActive} activator={(
      <Button
        onClick={togglePopoverActive}
        disabled={disabled}
        disclosure={!popoverActive ? 'down' : 'up'}
        >
          {selectedDate.toDateString()}
      </Button>
    )}>
      <ActionList
        items={ dates.map(({ delivered, count }) => {
          const d = new Date(delivered); 
          const label = <><Badge>{ count }</Badge> <span>{ d.toDateString() }</span></>;
          return { 
            content: label, 
            onAction: () => setSelectedDateChange(d),
          }
        })}
      />
    </Popover>
  );
}

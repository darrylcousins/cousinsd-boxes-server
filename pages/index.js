import React from 'react';
import { Card, Tabs, EmptyState, Loading } from '@shopify/polaris';
import { Context, TitleBar } from '@shopify/app-bridge-react';
import { Redirect } from "@shopify/app-bridge/actions";

const Index = () => {
  return (
    <>
      <TitleBar title='Boxes' />
      <Card>
        <EmptyState
          heading="Manage boxes on store"
          action={{
            content: 'View boxes',
            onAction: () => console.log('clicked'),
          }}
          secondaryAction={{
            content: 'View orders',
            onAction: () => console.log('clicked'),
          }}
          fullWidth={true}
          centeredLayout={false}
        >
          <p>Some content for home page</p>
        </EmptyState>
      </Card>
    </>
  );
}

export default Index;

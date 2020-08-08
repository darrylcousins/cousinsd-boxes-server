import React from 'react';
import {
  Button,
} from '@shopify/polaris';
import {
  EditMinor,
} from '@shopify/polaris-icons';
import { Redirect } from "@shopify/app-bridge/actions";
import { Context } from '@shopify/app-bridge-react'

export default function ContextLink({ shopifyId, title }) {

  return (
    <Context.Consumer>
      { app => {
        const redirect = Redirect.create(app);
        return (
          <Button 
            plain
            external
            onClick={() => redirect.dispatch(
              Redirect.Action.ADMIN_PATH,
              { path: `/products/${shopifyId}`, newContext: true }
            )}
            icon={ title ? null : EditMinor }
          >
            { title ? title : '' }
          </Button>
        );
      }}
        </Context.Consumer>
  );
};

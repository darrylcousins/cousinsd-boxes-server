import React from 'react';
import { Card, Loading } from '@shopify/polaris';
import { TitleBar } from '@shopify/app-bridge-react';
import loadable from "@loadable/component";
import LoadingPageMarkup from './../src/components/common/LoadingPageMarkup';

const Loader = () => (
  <React.Fragment>
    <Loading />
    <LoadingPageMarkup />
  </React.Fragment>
);

const LoadableOrders = loadable(() => import('./../src/components/orders/OrderListWrapper'), {
    fallback: <Loader />
});

export default function Orders() {

  return (
    <>
      <TitleBar
        title='Orders'
      />
      <Card>
        <LoadableOrders />
      </Card>
    </>
  );
}

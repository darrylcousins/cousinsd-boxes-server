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

const LoadableProducts = loadable(() => import('./../src/components/products/ProductList'), {
    fallback: <Loader />
});

export default function Products() {

  return (
    <>
      <TitleBar
        title='Products'
      />
      <Card>
        <LoadableProducts />
      </Card>
    </>
  );
}

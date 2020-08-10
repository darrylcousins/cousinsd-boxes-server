import React, { useState, useCallback } from 'react';
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

const LoadableBoxes = loadable(() => import('./../src/components/boxes/BoxList'), {
    fallback: <Loader />
});

export default function Boxes() {

  return (
    <>
      <TitleBar
        title='Boxes'
      />
      <Card>
        <LoadableBoxes />
      </Card>
    </>
  );
}

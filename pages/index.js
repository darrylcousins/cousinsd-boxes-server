import React, { useState, useCallback } from 'react';
import { useParams, BrowserRouter, Route, Link, Switch, useHistory } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Card, Tabs, EmptyState, Loading } from '@shopify/polaris';
import { TitleBar } from '@shopify/app-bridge-react';
import loadable from "@loadable/component";

/* tab stuff */
const tabs = [
  {
    id: 'home',
    content: 'Home',
    accessibilityLabel: 'Home',
    panelID: 'home',
  },
  {
    id: 'orders',
    content: 'Orders',
    accessibilityLabel: 'Orders',
    panelID: 'orders',
  },
  {
    id: 'boxes',
    content: 'Boxes',
    accessibilityLabel: 'Boxes',
    panelID: 'boxes',
  },
  { 
    id: 'products',
    content: 'Produce',
    accessibilityLabel: 'Produce',
    panelID: 'products',
  },
  /*
  { 
    id: 'subscribers',
    content: 'Subscribers',
    accessibilityLabel: 'Subscribers',
    panelID: 'subscribers',
  },
  { 
    id: 'subscriptiontypes',
    content: 'Subscription Types',
    accessibilityLabel: 'Subscription Types',
    panelID: 'subscriptiontypes',
  },
  */
];
/* end tab stuff */


const LoadableOrders = loadable(() => import('./../src/components/orders/OrderListWrapper'), {
    fallback: <Loading />
});

function Orders() {
  return (
    <>
      <TitleBar title='Orders' />
      <Card><LoadableOrders /></Card>
    </>
  );
}

const LoadableBoxes = loadable(() => import('./../src/components/boxes/BoxList'), {
    fallback: <Loading />
});

function Boxes() {
  return (
    <>
      <TitleBar title='Boxes' />
      <Card><LoadableBoxes /></Card>
    </>
  );
}

const LoadableSubscriptions = loadable(() => import('./../src/components/subscriptions/SubscriptionList'), {
    fallback: <Loading />
});

function Subscriptions() {
  return (
    <>
      <TitleBar title='Subscriptions' />
      <Card><LoadableSubscription /></Card>
    </>
  );
}

const LoadableSubscribers = loadable(() => import('./../src/components/subscriptions/SubscriberList'), {
    fallback: <Loading />
});

function Subscribers() {
  return (
    <>
      <TitleBar title='Subscribers' />
      <Card><LoadableSubscribers /></Card>
    </>
  );
}

const LoadableSubscriptionTypes = loadable(() => import('./../src/components/subscriptions/SubscriptionTypeList'), {
    fallback: <Loading />
});

function SubscriptionTypes() {
  return (
    <>
      <TitleBar title='Subscription Types' />
      <Card><LoadableSubscriptionTypes /></Card>
    </>
  );
}

const LoadableProducts = loadable(() => import('./../src/components/products/ProductList'), {
    fallback: <Loading />
});

function Products() {
  return (
    <>
      <TitleBar title='Products' />
      <Card><LoadableProducts /></Card>
    </>
  );
}

function NotFound() {
  return (
    <>
      <TitleBar title='404' />
      <Card><h1>Not found</h1></Card>
    </>
  );
}

function Subscription() {

  const { uid } = useParams();
  console.log(uid);

  return (
    <>
      <TitleBar title='Subscription' />
      <Card><SubscriptionDetail uid={uid} /></Card>
    </>
  );
}

function App(props) {

  const [tabSelected, setTabSelected] = useState(0);
  const history = useHistory();

  const handleTabSelect = (e) => {
    setTabSelected(e);
    if (e === 0) {
      history.push(`/`);
    } else {
      history.push(`/${tabs[e].id}`);
    }
  };

  const Index = () => {
    return (
      <>
        <TitleBar title='Boxes' />
        <Card>
          <EmptyState
            heading="Manage boxes on store"
            action={{
              content: 'View boxes',
              onAction: () => handleTabSelect(2),
            }}
            secondaryAction={{
              content: 'View orders',
              onAction: () => handleTabSelect(1),
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

  return(
    <>
    <Tabs tabs={tabs} selected={tabSelected} onSelect={handleTabSelect}>
      <Switch>
        <Route path="/" exact component={Index} />
        <Route path="/orders" component={Orders} />
        <Route path="/boxes" component={Boxes} />
        <Route path="/products" component={Products} />
        <Route path="/subscriptiontypes" component={SubscriptionTypes} />
        <Route component={NotFound}/>
      </Switch>
    </Tabs>
    </>
  );
}

/*
        <Route path="/subscribers" component={Subscriptions} />
        <Route path="/subscription/:uid" component={Subscription} />
*/
export default App;

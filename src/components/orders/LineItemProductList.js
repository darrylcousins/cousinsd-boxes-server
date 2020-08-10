import React, { useRef, useEffect } from 'react';
import { Query } from '@apollo/react-components';
import {
  Banner,
  Loading,
  Spinner,
} from '@shopify/polaris';
import { ProductQueries } from '../../graphql/queries';

export default function LineItemProductList({ idList, produce }) {

  /*
  const products = list.filter(el => {
    const id = el[0];
    const qty = el[1];

    if (!produce) return true;
    const handle = numberedStringToHandle(el);
    return (produce.indexOf(handle) > -1);
  });
  */

  const ulRef = useRef(null);

  useEffect(() => {
    if (ulRef.current) {
      ulRef.current.style.setProperty('--max-height', ulRef.current.scrollHeight + 'px'); 
    }
  });

  let qty_map = new Map();
  let ids = Array();

  idList.map(el => {
    if (el[1] > 1) {
      qty_map.set(el[0], el[1]);
    };
    ids.push(el[0]);
  });

  const input = { ids };

  return (
    <Query
      query={ProductQueries.getProducts}
      variables={{ input }}
      fetchPolicy='no-cache'
    >
      {({ loading, error, data, refetch }) => {
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

        const products = data.getProducts.filter(el => {
          if (!produce) return true;
          return (produce.indexOf(el.shopify_handle) > -1);
        });

        return (
          <ul 
            className={`overflow${ products.length > 1 ? ' listed'  : '' }` }
            ref={ulRef}
          >
              { products.map((el) => {
                let title = el.shopify_title;
                if (qty_map.has(el.id)) title += ` (${qty_map.get(el.id)})`;
                return <li key={el.id}>{ title }</li>;
              }) }
          </ul>
        );
      }}
    </Query>
  );
}

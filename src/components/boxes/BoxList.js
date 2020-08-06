import React, { useEffect, useState, useCallback } from 'react';
import {
  Banner,
  Button,
  ButtonGroup,
  Checkbox,
  EmptyState,
  DataTable,
  Icon,
  Loading,
  Sheet,
  TextStyle,
  Toast,
} from '@shopify/polaris';
import {
    MinusMinor
} from '@shopify/polaris-icons';
import { Query } from '@apollo/react-components';
import { execute, useQuery } from '@apollo/client';

import { LocalHttpLink } from '../../graphql/client';
import { UTCDateOnly } from '../../lib';
import LoadingPageMarkup from '../common/LoadingPageMarkup';
import ItemDatePicker from '../common/ItemDatePicker';
import DateSelector from '../common/DateSelector';
import SheetHelper from '../common/SheetHelper';
import BoxActions from './BoxActions';
import BoxShopTitle from './BoxShopTitle';
import BoxProductList from './BoxProductList';
import BoxAdd from './BoxAdd';
import { CacheQueries, BoxQueries, BoxMutations } from '../../graphql/queries';

export default function BoxList() {

  /* boxes datatable stuff */
  const { data } = useQuery(CacheQueries.getSelectedDate);
  /* query and pagination */
  const [delivered, setDelivered] = useState(data.selectedDate);

  /* pagination if required */
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  /* query offset and limit */
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);

  /* create query input variables */
  const [input, setInput] = useState({
    delivered: UTCDateOnly(delivered),
    limit: 10,
    offset: 0,
  });
  const [dates, setDates] = useState([]);
  /* end boxes datatable stuff */

  /* add box button */
  const [addBox, setAddBox] = useState(false);
  const toggleAddBox = useCallback(() => setAddBox(!addBox), [addBox]);
  /* end add box button */

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(false);
  const toggleToast = useCallback((message) => {
    setShowToast((showToast) => !showToast);
    setToastMessage(message);
  }, []);

  const BoxToast = ({ message }) => (
    <Toast content={message} duration={3000} onDismiss={() => toggleToast('')} />
  );

  const addCompleted = () => {
    toggleAddBox();
    toggleToast('Box added');
  };

  useEffect(() => {
    execute(LocalHttpLink, { query: BoxQueries.getBoxesDeliveredAndCount })
      .subscribe({
        next: (res) => {
          setDates(res.data.getBoxesDeliveredAndCount.map(el => ({ delivered: el.delivered, count: el.count })));
        },
        error: (err) => console.log('get box delivered and count error', err),
        //complete: () => console.log('execute orders complete'),
      });
  }, [input]);

  /* checkbox stuff */
  const [checkedId, setCheckedId] = useState(0);
  const [checked, setChecked] = useState(false);
  const handleCheckedChange = useCallback((newChecked, id) => {
    setChecked(newChecked);
    setCheckedId(id);
    }, []
  );
  const clearChecked = () => {
      setChecked(false);
      setCheckedId(0);
  };
  /* end checkbox stuff */

  return (
    <Query
      query={BoxQueries.getBoxesByDelivered}
      fetchPolicy='no-cache'
      variables={ { input } }
    >
      {({ loading, error, data, refetch }) => {
        if (error) console.log(JSON.stringify(error, null, 2));
        const isError = error && (
          <Banner status="critical">{error.message}</Banner>
        );
        const isLoading = loading && (
          <React.Fragment>
            <Loading />
            <LoadingPageMarkup />
          </React.Fragment>
        );
        /* datatable stuff */

        let rows = Array();
        let count = 0;
        if (!error && !loading) {
          rows = data.getBoxesByDelivered.rows;
          count = data.getBoxesByDelivered.count;

          /* cannot do this in here - move out
          setPageCount(parseInt((count/limit) + ((count/limit)%1 !== 0 ? 1 : 0)));
          setPageNumber(Math.round((offset + limit)/limit));
          setTotalCount(count);
          */
        };
        /* Hold this back for now XXX TODO
            <BoxShopTitle
              key={2}
              id={parseInt(box.id)}
              title={box.shopifyBox.shopify_title}
            />,
            <ItemDatePicker
              key={3}
              id={parseInt(box.id)}
              refetch={refetch}
              mutation={BoxMutations.updateBox}
              date={new Date(box.delivered)}
              fieldName='delivered'
              variation='subdued'
            />,
            */

        const tableRows = (rows.length === 0) ? Array(0) : rows.map((box) => {
          console.log(JSON.stringify(box, null, 2));
          return [
            <Checkbox 
              key={0}
              id={box.id}
              label={box.shopify_title}
              labelHidden={true}
              onChange={handleCheckedChange}
              checked={checked && checkedId === box.id}
            />,
            <TextStyle
              variation='subdued'>
                {box.shopifyBox.shopify_title}
            </TextStyle>,
            <TextStyle
              variation='subdued'>
                {new Date(box.delivered).toDateString()}
            </TextStyle>,
            <BoxProductList
              key={4}
              id={parseInt(box.id)}
              isAddOn={false}
            />,
            <BoxProductList
              key={5}
              id={parseInt(box.id)}
              isAddOn={true}
            />,
          ];
        });
        /* end datatable stuff */

        const refetchQuery = () => {
          const temp = { ...input };
          setInput(temp);
          refetch({ input });
        }

        const handleDateChange = (date) => {
          const input = { delivered: UTCDateOnly(date), limit, offset };
          setDelivered(date);
          setInput(input);
          refetch({ input });
        };

        return (
          <React.Fragment>
            <Sheet open={addBox} onClose={toggleAddBox}>
              <SheetHelper title='Add Box' toggle={toggleAddBox}>
                <BoxAdd
                  onComplete={addCompleted}
                  refetch={refetchQuery}
                />
              </SheetHelper>
            </Sheet>
            <div style={{ padding: '1.6rem' }}>
              <ButtonGroup segmented >
                <BoxActions
                  checked={checked}
                  checkedId={checkedId}
                  onComplete={clearChecked}
                  refetch={refetchQuery}
                />
                <DateSelector
                  handleDateChange={handleDateChange}
                  dates={dates}
                  disabled={ Boolean(isLoading) } />
                <Button 
                  primary
                  onClick={() => toggleAddBox()}
                >Add Box</Button>
              </ButtonGroup>
            </div>
            { isError && isError } 
            { isLoading ? isLoading :
              <DataTable
                columnContentTypes={Array(5).fill('text')}
                headings={[
                  ( checked ? (
                    <Button 
                      key={0}
                      plain
                      onClick={() => clearChecked()}
                    >
                      <div style={{ 
                        width: '18px',
                        height: '18px',
                        border: '1px solid silver',
                        background: 'transparent',
                        borderRadius: '3px',
                      }}>
                        <Icon
                          color='inkLightest'
                          source={MinusMinor} />
                      </div>
                    </Button>
                  ) : '' ),
                  <strong key={2}>Store Product</strong>,
                  <strong key={3}>Delivery Date</strong>,
                  <strong key={4}>Included Produce</strong>,
                  <strong key={5}>Add On Produce</strong>,
                ]}
                rows={tableRows}
              />
            }
            { typeof rows !== 'undefined' && rows.length === 0 &&
              <EmptyState
                heading="Manage your vege boxes"
                action={{content: 'Add box', onAction: toggleAddBox}}
                secondaryAction={{content: 'Learn more', url: 'http://cousinsd.net/'}}
              >
                <p style={{ textAlign: 'left' }}>
                  Add boxes with products and link to your products on your store
                </p>
              </EmptyState>
            }
            { showToast && toastMessage && <BoxToast message={toastMessage} /> }
          </React.Fragment>
        );
      }}
    </Query>
  );
}


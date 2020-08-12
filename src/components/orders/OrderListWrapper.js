import React, { useEffect, useState, useCallback } from 'react';
import fetch from 'isomorphic-fetch';
import {
  Banner,
  Button,
  ButtonGroup,
  Checkbox,
  Loading,
  Modal,
  Pagination,
  TextField,
  Toast,
} from '@shopify/polaris';
import { useQuery, execute } from '@apollo/client';
import { ShopifyHttpLink } from '../../graphql/client';
import { LocalHttpLink } from '../../graphql/client';
import {
  dateToISOString,
  UTCDateOnly,
  makePromise,
  makeThrottledPromise,
  getPdf,
  getCsv
} from '../../lib';
import DateSelector from '../common/DateSelector';
import NoteWrapper from './NoteWrapper';
import BoxSelector from './BoxSelector';
import OrderList from './OrderList';
import createLabelDoc from './labels';
import createPickingDoc from './pickinglist';
import createCsvRows from './csvrows';
import { CacheQueries, BuildOrderQueries, OrderQueries, BoxQueries } from '../../graphql/queries';

export default function OrderListWrapper() {

  const open = false;
  const { data } = useQuery(CacheQueries.getSelectedDate);
  const [delivered, setDelivered] = useState(data.selectedDate);
  const [labelLoading, setLabelLoading] = useState(false);
  const [pickingLoading, setPickingLoading] = useState(false);
  const [csvExportLoading, setCsvExportLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(false);
  const toggleToast = useCallback((message) => {
    setShowToast((showToast) => !showToast);
    setToastMessage(message);
  }, []);

  /* modals for printing feedback stuff */
  const [pickingListModalOpen, setPickingListModalOpen] = useState(open);
  const [labelModalOpen, setLabelModalOpen] = useState(open);
  const [csvExportModalOpen, setCsvExportModalOpen] = useState(open);
  /* end modals for printing feedback stuff */

  /* checkbox stuff */
  const [checkedIds, setCheckedIds] = useState([]);
  const [ids, setIds] = useState([]);
  const [dates, setDates] = useState([]);

  const handleCheckedChange = useCallback((newChecked, id) => {
    if (newChecked) {
      setCheckedIds(checkedIds.concat([id]));
    } else {
      setCheckedIds(checkedIds.filter(el => el != id));
    }
    }, [checkedIds]);

  const handleCheckAll = useCallback((checked) => {
    if (checked) setCheckedIds(ids);
    if (!checked) setCheckedIds([]);
  }, [ids, checkedIds]);
  /* end checkbox stuff */

  /* feedback on actions */
  const [feedbackText, setFeedbackText] = useState('');
  /* end feedback on actions */

  /* query stuff */
  const [query, setQuery] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [input, setInput] = useState({ delivered: delivered });
  /* end query stuff */

  /* filters */
  const [boxFilter, setBoxFilter] = useState(null);
  const [boxes, setBoxes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [nameSearchTerm, setNameSearchTerm] = useState('');
  const [searchButtonLoading, setSearchButtonLoading] = useState(false);

  const handleNameSearchTermChange = useCallback((value) => {
    setNameSearchTerm(value);
    }, [nameSearchTerm]);

  const handleNameSearchClear = useCallback(() => {
    setNameSearchTerm('');
    setSearchTerm('');
    }, [searchTerm, nameSearchTerm]);

  const handleNameSearch = () => {
    setSearchTerm(nameSearchTerm);
    setInput({ ...input });
    //setLoading(true);
    //setSearchButtonLoading(true);
  };

  const handleDateChange = (date) => {
    setDelivered(date);
    setInput({ delivered: date });
  };

  const handleBoxSelected = (box) => {
    // filters query by box product (i.e. Small Box)
    setBoxFilter(box);
  };
  /* end filters */

  /* page stuff */
  const handleNextPage = useCallback(() => {
    setLoading(true);
    setOffset(offset+limit);
  }, [offset]);

  const handlePreviousPage = useCallback(() => {
    setLoading(true);
    setOffset(offset-limit);
  }, [offset]);
  /* end page stuff */

  /* collect orders and pageInfo: hasNextPage and hasPreviousPage */
  useEffect(() => {
    const variables = { input: {
        offset,
        limit,
        shopify_product_id: boxFilter ? boxFilter.shopifyBox.shopify_product_id : null,
        shopify_title: searchTerm.length ? searchTerm : null,
        ...input
      }
    };
    execute(LocalHttpLink, { query: OrderQueries.getOrders, variables })
      .subscribe({
        next: (res) => {
          let rows = [];
          let count = 0;
          let orderids = [];
          let uniqueIds = [];
          if (!res.errors) {
            rows = res.data.getOrders.rows;
            count = res.data.getOrders.count;
            orderids = rows.map(el => el.shopify_order_id);
            uniqueIds = [...new Set(orderids)];
          } else {
            console.log('getOrders error', JSON.stringify(res.errors, null, 2));
          }
          if (uniqueIds.length > 0) {
            setQuery(BuildOrderQueries.getMainQuery(uniqueIds));
            setIds(uniqueIds.map(el => el.toString()));
          } else {
            setQuery(null);
            setIds([]);
          }

          setPageCount(parseInt((count/limit) + ((count/limit)%1 !== 0 ? 1 : 0)));
          setPageNumber(Math.round((offset + limit)/limit));
          setTotalCount(count);
          setLoading(false);
          setSearchButtonLoading(false);
        },
        error: (err) => console.log('get orders error', err),
      });
  }, [input, delivered, offset, boxFilter, searchTerm]);

  /* collect data for the date selection */
  useEffect(() => {
    execute(LocalHttpLink, { query: OrderQueries.getOrdersDeliveredAndCount })
      .subscribe({
        next: (res) => {
          if (!res.errors) {
            //console.log('got this for orders delivered and count ', res);
            setDates(res.data.getOrdersDeliveredAndCount.map(el => ({ delivered: el.delivered, count: el.count })));
          } else {
            console.log('getOrdersDeliveredAndCount error:', JSON.stringify(res.errors, null, 2));
          }
        },
        error: (err) => console.log('get order dates error', err),
      });
  }, []);
  /* end query stuff */

  /* collect data for the box filter selection */
  useEffect(() => {
    const variables = { input: {
        delivered,
      }
    };
    execute(LocalHttpLink, { query: BoxQueries.getAllBoxesByDelivered, variables })
      .subscribe({
        next: (res) => {
          if (!res.errors) {
            //console.log('got this for boxes by delivered', res);
            setBoxes(res.data.getAllBoxesByDelivered);
          } else {
            console.log('getAllBoxesByDelivered error', JSON.stringify(res.errors, null, 2));
          }
        },
        error: (err) => console.log('get boxes error', err),
      });
  }, [delivered]);
  /* end collect data for the box filter selection */

  /* printing helper methods */
  const docToPdf = (docdefinition) => {
      return getPdf(docdefinition)
      .then(response => response.blob())
      .then(blob => URL.createObjectURL(blob))
  };

  /* collect query variables from current state */
  const collectVariables = () => {
    return ({
      input: {
        offset: 0,
        limit: totalCount,
        delivered: input.delivered,
        shopify_product_id: boxFilter ? boxFilter.shopify_id : null,
      }
    });
  };

  /* collect query promises */
  const collectPromises = ({ useChecked, rows, getQuery }) => {
    const promises = [];
    if (useChecked) { // set on open modal
      const orderids = checkedIds; // always less than limit
      const query = getQuery(orderids);
      promises.push(makePromise(execute(ShopifyHttpLink, { query })));
    } else {
      const orderids = [...new Set(rows.map(el => el.shopify_order_id))];
      for (let i=0; i<pageCount; i++) {
        const query = getQuery(orderids.slice(i*limit, i*limit+limit));
        promises.push(makeThrottledPromise(execute(ShopifyHttpLink, { query }), i+1));
      }
    }
    return promises;
  };

  const OrderToast = ({ message }) => (
    <Toast content={message} duration={3000} onDismiss={() => toggleToast('')} />
  );

  /* end printing helper methods */

  /* pdf labels */
  const preparePrintLabels = () => {
    if (checkedIds.length || boxFilter) {
      // show modal and ask the question
      setLabelModalOpen(true);
    } else {
      printLabels(false);
    }
  };

  const printLabels = ({ useChecked, useBoxFilter }) => {
    setLabelModalOpen(false)
    setLabelLoading(true);
    setFeedbackText('Requesting data');
    const variables = collectVariables();
    execute(LocalHttpLink, { query: OrderQueries.getOrders, variables })
      .subscribe({
        next: (res) => {
          const rows = res.data.getOrders.rows;
          const promises = collectPromises({ useChecked, rows, getQuery: BuildOrderQueries.getExportQuery });
          const response = Promise.all(promises)
            .then(data => {
              setFeedbackText('Creating pdf file');
              return createLabelDoc({ data, delivered });
            })
            .then(dd => docToPdf(dd))
            .then(url => {
              var link = document.createElement('a');
              link.href = url;
              link.download = `labels-${dateToISOString(new Date(delivered))}.pdf`;
              link.click();
            })
            .catch(err => console.log(err))
            .finally(() => {
              setLabelLoading(false);
              setFeedbackText('');
              toggleToast('Labels saved to download folder');
            });
        },
        error: (err) => console.log('get orders error', err),
      });
  };
  /* end pdf labels */

  /* create the picking list */
  const preparePrintPickingList = () => {
    if (checkedIds.length || boxFilter) {
      // show modal and ask the question
      setPickingListModalOpen(true);
    } else {
      printPickingList({ useChecked: false, useBoxFilter: false });
    }
  };

  const printPickingList = ({ useChecked, useBoxFilter }) => {
    setPickingListModalOpen(false)
    setPickingLoading(true);
    setFeedbackText('Requesting data');
    const variables = collectVariables();
    execute(LocalHttpLink, { query: OrderQueries.getOrders, variables })
      .subscribe({
        next: (res) => {
          const rows = res.data.getOrders.rows;
          const promises = collectPromises({ useChecked, rows, getQuery: BuildOrderQueries.getShortQuery });
          const response = Promise.all(promises)
            .then(data => {
              setFeedbackText('Creating pdf file');
              return createPickingDoc({ data, delivered });
            })
            .then(dd => docToPdf(dd))
            .then(url => {
              var link = document.createElement('a');
              link.href = url;
              link.download = `picking-list-${dateToISOString(new Date(Date.parse(delivered)))}.pdf`;
              link.click();
            })
            .catch(err => console.log(err))
            .finally(() => {
              setPickingLoading(false);
              setFeedbackText('');
              toggleToast('Picking list saved to download folder');
            });
        },
        error: (err) => console.log('get orders error', err),
      });
  };
  /* end create the picking list */

  /* handle cvs export */
  const prepareCsvExport = () => {
    if (checkedIds.length || boxFilter) {
      // show modal and ask the question
      setCsvExportModalOpen(true);
    } else {
      printCsvExport({ useChecked: false, useBoxFilter: false });
    }
  };

  const printCsvExport = ({ useChecked, useBoxFilter }) => {
    setCsvExportModalOpen(false)
    setCsvExportLoading(true);
    setFeedbackText('Requesting data');
    const variables = collectVariables();
    execute(LocalHttpLink, { query: OrderQueries.getOrders, variables })
      .subscribe({
        next: (res) => {
          const rows = res.data.getOrders.rows;
          const promises = collectPromises({ useChecked, rows, getQuery: BuildOrderQueries.getExportQuery});
          const response = Promise.all(promises)
            .then(data => createCsvRows({ data, delivered }))
            .then(csvData => {
              setFeedbackText('Creating csv file');
              csvData.rows.unshift(csvData.headers);
              return getCsv(csvData.rows);
            })
            .then(response => response.blob())
            .then(blob => URL.createObjectURL(blob))
            .then(url => {
              var link = document.createElement('a');
              link.href = url;
              link.download = `export-${dateToISOString(new Date(delivered))}.csv`;
              link.click();
            })
            .catch(err => console.log(err))
            .finally(() => {
              setCsvExportLoading(false);
              setFeedbackText('');
              toggleToast('Export saved to download folder');
            });
        },
        error: (err) => console.log('get orders error', err),
      });
  };
  /* end handle cvs export */

  /* checkboxes for the list */
  const checkbox = (
    <Checkbox 
      id='all'
      label='Select/deselect all'
      labelHidden={true}
      onChange={handleCheckAll}
      checked={checkedIds.length > 0}
    />
  );

  const LineCheckbox = ({ id, name }) => {
    return (
      <Checkbox 
        id={id}
        label={name}
        labelHidden={true}
        onChange={handleCheckedChange}
        checked={checkedIds.indexOf(id) > -1}
      />
    );
  };
  /* end checkboxes for the list */

  /* pagination objects */
  const DisplayPageInfo = () => {
    if (pageCount > 1) {
      return (
        <NoteWrapper segmentedLeft={true}>
          { `Page ${pageNumber} of ${pageCount} pages (${totalCount} orders)` }
        </NoteWrapper>
      );
    };
    return null;
  };
  /* end pagination objects */

  /* feedback banner */
  const FeedbackBanner = () => {
    return (
      <Banner status='info'>
        <div style={{ position: 'relative', color: '#4d8ab3', fontWeight: 'bold' }}>
          <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ feedbackText }
        </div>
      </Banner>
    );
  }
  /* end feedback banner */

  return (
    <React.Fragment>
      { (loading || labelLoading || pickingLoading || csvExportLoading) && <Loading /> }
      <div style={{ padding: '.6rem' }}>
        { feedbackText && <FeedbackBanner /> }
      </div>
      <div style={{ padding: '1.6rem' }}>
        <ButtonGroup segmented >
          <Button
            disabled={totalCount === 0}
            primary={checkedIds.length > 0}
            onClick={prepareCsvExport}
            loading={csvExportLoading}
          >
            Export
          </Button>
          <Button
            disabled={totalCount === 0}
            primary={checkedIds.length > 0}
            onClick={preparePrintPickingList}
            loading={pickingLoading}
          >
            Print Picking List
          </Button>
          <Button
            //disabled={checkedIds.length === 0}
            disabled={totalCount === 0}
            primary={checkedIds.length > 0}
            onClick={preparePrintLabels}
            loading={labelLoading}
          >
            Print Labels
          </Button>
          <DateSelector 
            handleDateChange={handleDateChange}
            dates={dates}
            disabled={ loading }
          />
          { pageCount > 0 &&
              <Pagination
                hasPrevious={ pageNumber > 1 && !loading }
                onPrevious={() => {
                  handlePreviousPage();
                }}
                hasNext={ pageNumber < pageCount && !loading }
                onNext={() => {
                  handleNextPage();
                }}
              />
          }
          <DisplayPageInfo />
        </ButtonGroup>
        <div style={{ padding: '1.6rem 0 0 0' }}>
          <ButtonGroup segmented >
            <BoxSelector 
              handleBoxSelected={handleBoxSelected}
              boxes={boxes}
              box={ boxFilter }
              disabled={ loading || boxes.length === 0 }
            />
            <TextField
              value={nameSearchTerm}
              placeholder='Search by order number...'
              onChange={handleNameSearchTermChange}
              clearButton={true}
              onClearButtonClick={ handleNameSearchClear }
            />
            <Button
              disabled={nameSearchTerm === ''}
              primary={nameSearchTerm !== ''}
              onClick={handleNameSearch}
              loading={searchButtonLoading}
            >
              Search
            </Button>
          </ButtonGroup>
        </div>
      </div>
      { query && !loading ? (
        <OrderList 
          input={input}
          checkbox={checkbox}
          LineCheckbox={LineCheckbox}
          query={query} />
      ) : (
        <div className='emptystate'>
          <h5>{`No box orders for delivery on ${delivered}.`}</h5>
          <ul>
            <li>
              Have boxes been created for { delivered }?
            </li>
            <li>
              Are there any orders for delivery on { delivered }?
            </li>
          </ul>
        </div>
      )}
      <Modal
        open={pickingListModalOpen}
        onClose={() => setPickingListModalOpen(false)}
        title='Print picking list for selected orders only?'
        primaryAction={{
          content: 'All orders',
          onAction: () => printPickingList({ useChecked: false, useBoxFilter: false }),
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: () => setPickingListModalOpen(false),
          },
          {
            content: 'Selected orders only',
            disabled: checkedIds.length === 0,
            onAction: () => printPickingList({ useChecked: true, useBoxFilter: false }),
            primary: true,
          },
          {
            content: 'Filtered orders only',
            disabled: boxFilter === null,
            onAction: () => printPickingList({ useChecked: false, useBoxFilter: true }),
            primary: true,
          },
        ]}
      />
      <Modal
        open={labelModalOpen}
        onClose={() => setLabelModalOpen(false)}
        title='Print labels for selected orders only?'
        primaryAction={{
          content: 'All orders',
          onAction: () => printLabels({ useChecked: false, useBoxFilter: false }),
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: () => setLabelModalOpen(false),
          },
          {
            content: 'Selected orders only',
            disabled: checkedIds.length === 0,
            onAction: () => printLabels({ useChecked: true, useBoxFilter: false }),
            primary: true,
          },
          {
            content: 'Filtered orders only',
            disabled: boxFilter === null,
            onAction: () => printLabels({ useChecked: false, useBoxFilter: true }),
            primary: true,
          },
        ]}
      />
      <Modal
        open={csvExportModalOpen}
        onClose={() => setCsvExportModalOpen(false)}
        title='Export selected orders only?'
        primaryAction={{
          content: 'All orders',
          onAction: () => printCsvExport({ useChecked: false, useBoxFilter: false }),
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: () => setCsvExportModalOpen(false),
          },
          {
            content: 'Selected orders only',
            disabled: checkedIds.length === 0,
            onAction: () => printCsvExport({ useChecked: true, useBoxFilter: false }),
            primary: true,
          },
          {
            content: 'Filtered orders only',
            disabled: boxFilter === null,
            onAction: () => printCsvExport({ useChecked: false, useBoxFilter: true }),
            primary: true,
          },
        ]}
      />
      { showToast && toastMessage && <OrderToast message={toastMessage} /> }
    </React.Fragment>
  );
}

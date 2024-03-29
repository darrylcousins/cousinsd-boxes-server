const fetch = require('isomorphic-fetch');
const parseFields = require('graphql-parse-fields')
const { Source } = require('graphql');

const getPdf = (dd) => {
  return fetch(`${HOST}/pdf`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dd),
  })
};

const getCsv = (data) => {
  return fetch(`${HOST}/csv`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  })
};

const numberFormat = ({ amount, currencyCode }) => {
  let amt = amount * 0.01; // amount comes in at cent decimal value
  let locale = 'en-NZ';
  if (currencyCode == 'NZD') locale = 'en-NZ';
  return (
    new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode
    }).format(amt)
  )
}

// sort array of [[ key, value ] ... ] pairs
const valueSort = (a, b) => {
  if (a[1] > a[1]) return 1;
  if (a[1] < a[1]) return -1;
  return 0;
}

const keySort = (a, b) => {
  if (a[0] > a[0]) return 1;
  if (a[0] < a[0]) return -1;
  return 0;
}

const nameSort = (a, b, key='title') => {
  const prodA = a[key].toLowerCase();
  const prodB = b[key].toLowerCase();
  if (prodA > prodB) return 1;
  if (prodA < prodB) return -1;
  return 0;
}

const getFieldsFromInfo = (info) => {
  const selections = info.fieldNodes[0] && info.fieldNodes[0].selectionSet && info.fieldNodes[0].selectionSet.selections;
  if (selections) {
    // create array of fields asked for by graphql
    const fields = selections.map((item) => {
      if (item.kind == 'Field' && !item.selectionSet) return item.name.value;
    }).filter(item => item !== '__typename')
      .filter(item => typeof(item) !== 'undefined');
    return fields;
  }
  return ['id'];
};

const mockResolveInfo = (query) => {
  const definitions = new Source(query).body.definitions;
  let fieldASTs;
  let fragments = {};
  definitions.forEach(def => {
    if (def.kind == 'OperationDefinition') {
      fieldASTs = def.selectionSet.selections;
    } else if (def.kind == 'FragmentDefinition' ) {
      fragments[def.name.value] = def;
    }
  });
  return { fieldASTs, fragments };
};

const getQueryFields = (query) => {
  const { fieldASTs, fragments } = mockResolveInfo(query);
  // parseFields can have arguments : info OR asts, fragments
  return parseFields(fieldASTs, fragments);
};

const filterFields = (fields) => {
  return Object.keys(fields).filter(key => (key !== '__typename') && (typeof fields[key] === 'boolean') );
};

const findErrorMessage = (error) => {
  if (!error) return error;
  if ('errors' in error) {
    error = error.errors[0];
    if (error && 'message' in error) return error.message;
    return error;
  }
  if ('graphQLErrors' in error) {
    error = error.graphQLErrors[0];
    if (error && 'extensions' in error) {
      error = error.extensions;
      if ('exception' in error) {
        error = error.exception;
        if ('errors' in error) {
          error = error.errors[0];
          if (error && 'message' in error) return error.message;
          return error;
        }
      }
    }
  }
  if (error && 'message' in error) return error.message;
  return error;
};

const makePromise = (observable) => {
  let completed = false;
  return new Promise((resolve, reject) => {
    observable.subscribe({
      next: data => {
        if (completed) {
          invariant.warn(
          `Promise Wrapper does not support multiple results from Observable`,
          );
        } else {
          completed = true;
          console.log('completeing request');
          resolve(data);
        }
      },
      error: reject,
    });
  });
}

const makeThrottledPromise = (observable, count) => {
  let completed = false;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('resolving throttled request', count);
      observable.subscribe({
        next: data => {
          if (data.errors) console.log(data.errors[0].message);
          //console.log(data);
          resolve(data);
        },
        error: reject,
      });
    }, 2000*count);
  });
}

const dateOnly = (date) => {
  if (date && typeof date === 'string') {
    date = new Date(date);
  } else if (!date) {
    date = new Date();
  };
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const res = new Date(year, month, day);
  console.log('got this date to save', res);
  return res;
}

const UTCDateOnly = (date) => {
  if (date && typeof date === 'string') {
    date = new Date(date);
  } else if (!date) {
    date = new Date();
  };
  var year = date.getFullYear();
  var month = date.getMonth();
  var day = date.getDate();
  return new Date(Date.UTC(year,month,day));
}

const dateToISOString = (date) => {
  date.setTime(date.getTime() + (12 * 60 * 60 * 1000));
  return date.toISOString().slice(0, 10); // try this out later
}

const toHandle = (title) => title.replace(/ /g, '-').toLowerCase();

const parseNumberedString = (str) => {
  // e.g. 'Baby Kale (2)' => 'Baby Kale' 
  str = str.trim();
  const match = str.match(/\(\d+\)$/);
  if (match) {
    str = str.slice(0, match.index).trim();
  }
  return str;
};

const numberedStringToHandle = (str) => {
  // e.g. 'Baby Kale (2)' => 'baby-kale' 
  str = str.trim();
  const match = str.match(/\(\d+\)$/);
  if (match) {
    str = str.slice(0, match.index).trim();
  }
  return str.replace(/ /g, '-').toLowerCase();
};

/* deal with a list of strings say: 'Baby Kale (2)' => baby-kale' */
const stringToArray = (arr) => arr.split(',')
  .map((el) =>  numberedStringToHandle(el))
  .filter((el) => el !== '')
  .map((el) => toHandle(el));

module.exports = {
  toHandle,
  numberedStringToHandle,
  parseNumberedString,
  stringToArray,
  dateOnly,
  UTCDateOnly,
  mockResolveInfo,
  getQueryFields,
  filterFields,
  dateToISOString,
  nameSort,
  keySort,
  valueSort,
  getFieldsFromInfo,
  findErrorMessage,
  makePromise,
  makeThrottledPromise,
  numberFormat,
  getPdf,
  getCsv,
};

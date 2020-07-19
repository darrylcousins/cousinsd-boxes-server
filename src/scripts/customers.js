const fs = require('fs');
const csv = require('csv-parser');
const fetch = require('node-fetch');

const postcodes = [
  '7520',
  '7512',
  '7600',
  '7602',
  '7604',
  '7608',
  '7614',
  '7630',
  '7632',
];

const getFetch = (url) => {
  return fetch(url).then(res => res.json());
};

const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));

const makeid = () => {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVXY";
  const text = possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
};

function *genids() {
  while (true) {
    yield makeid();
  }
};

const id = genids();

let addresses = [];
let customers = [];
const count = 200;
const url = `https://randomuser.me/api/?results=${ count }&nat=NZ&inc=name,email,phone&noinfo`;
let counter = 0;
let alphakey = 1;
const possible = Array.from('ABCDEFGHIJKLMNOPQRSTUVXY');

fs.createReadStream('canterbury.csv')
  .pipe(csv())
  .on('data', (row) => {
    if (addresses.length <= count) {
      if (row.street.startsWith(possible[alphakey])) {
        console.log(addresses.length, counter, alphakey);
        const [temp1, address2, city] = row.matchedaddress.split(', ');
        const address1 = `${getRandomInt(50).toString()} ${temp1}`;
        const province = 'CAN';
        const country = 'NZ';
        const zip = row.postcode;
        if (city && address1 && address2) {
          const address = {
            address1,
            address2,
            city,
            zip,
            province,
            country
          };
          addresses.push(address);
          counter++;
          if (counter%10 === 0) alphakey++;
        }
      };
    };
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
    getFetch(url)
      .then(res => {
        res.results.forEach((el, idx) => {
          //console.log(idx, el.name.first, el.name.last, el.email);
          //console.log(addresses[idx]);
          //const phone = `${el.phone.slice(6).replace('-', '')}`;
          const customer = {
            first_name: el.name.first,
            last_name: el.name.last,
            email: el.email,
            verified_email: true,
          };
          addresses[idx].first_name = el.name.first;
          addresses[idx].last_name = el.name.last;
          customer.addresses = [addresses[idx]];
          customers.push(customer);
        });
        return customers;
      })
      .then(customers => {
        const final = {
          customers
        }
        const json = JSON.stringify(final, null, 2);
        fs.writeFile('customers.json', json, (err) => {
          if (err) {
            console.log("An error occured while writing Customers to File.");
            return console.log(err);
          }
          console.log("Customers file has been saved.");
        });
      })
      .catch((err) => {
        console.log('err', err);
      })
      .finally(() => {
        console.log('Completed');
      });
  });

const fs = require('fs');
const csv = require('csv-parser');

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

const writeStream = fs.createWriteStream('canterbury.csv');

fs.createReadStream('nzpostcodes_v2.csv')
  .pipe(csv())
  .on('headers', (headers) => {
    writeStream.write(headers.join(',') + '\n');
  })
  .on('data', (row) => {
    if (postcodes.indexOf(row.postcode) > -1 || row.postcode.startsWith('80')) {
      // do something
      //writeStream.write(row);
      //
      //console.log(row);
      const rowStr = Object.values(row).map(el => `"${el}"`).join(',') + '\n';
      writeStream.write(rowStr);
    };
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });

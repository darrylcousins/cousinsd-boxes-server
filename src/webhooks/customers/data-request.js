
const customerDataRequest = (webhook) => {
  const payload = webhook.payload;
  console.log('Received customer data request:', payload);
}

module.exports = customerDataRequest;


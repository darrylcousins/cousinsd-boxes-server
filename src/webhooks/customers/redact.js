
const customerRedact = (webhook) => {
  const payload = webhook.payload;
  console.log('Received customer redact:', payload);
}

module.exports = customerRedact;

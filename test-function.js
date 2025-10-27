// Test simple de la función
const handler = require('./netlify/functions/prestashop.js').handler;

const testEvent = {
  path: '/api/prestashop/products',
  httpMethod: 'POST',
  queryStringParameters: { display: 'full', limit: '1' },
  body: JSON.stringify({
    apiUrl: 'https://100x100chef.com/shop/api',
    apiKey: 'test'
  }),
  headers: { 'content-type': 'application/json' }
};

console.log('Probando la función...');
handler(testEvent, {}, (err, result) => {
  console.log('Resultado:', result);
});

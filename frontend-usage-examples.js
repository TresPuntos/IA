// Ejemplo de uso del proxy desde el frontend
// Este código ya está implementado en EcommerceConnections.tsx

// Ejemplo: listar productos (ajusta el endpoint real de PS, p.ej. "products")
fetch('/api/prestashop/products?display=full&limit=20')
  .then(async r => {
    if (!r.ok) throw new Error(await r.text());
    return r.headers.get('content-type')?.includes('application/json') ? r.json() : r.text(); // PS puede devolver XML
  })
  .then(data => console.log('OK', data))
  .catch(err => console.error('ERROR', err));

// Ejemplo: obtener un producto específico
fetch('/api/prestashop/products/1')
  .then(async r => {
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  })
  .then(product => console.log('Producto:', product))
  .catch(err => console.error('Error:', err));

// Ejemplo: obtener categorías
fetch('/api/prestashop/categories?display=full&limit=10')
  .then(async r => {
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  })
  .then(categories => console.log('Categorías:', categories))
  .catch(err => console.error('Error:', err));










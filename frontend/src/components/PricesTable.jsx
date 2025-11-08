import React from 'react';

export default function PricesTable({ rows }) {
  // rows: [{store, item:{name,price,size,url} }]
  const parsed = rows.map(r => ({
    store: r.store,
    price: r.item?.price ?? null,
    name: r.item?.name ?? ''
  }));
  // find cheapest (numeric)
  const numeric = parsed.filter(p => typeof p.price === 'number');
  const cheapest = numeric.length ? numeric.reduce((a,b) => (a.price < b.price ? a : b)) : null;

  return (
    <div>
      <h3>Results</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: 6 }}>Store</th>
            <th style={{ textAlign: 'left', padding: 6 }}>Product</th>
            <th style={{ textAlign: 'left', padding: 6 }}>Price</th>
          </tr>
        </thead>
        <tbody>
          {parsed.map((p, idx) => (
            <tr key={idx} style={{ background: (cheapest && p.store === cheapest.store) ? '#e3ffe3' : 'transparent' }}>
              <td style={{ padding: 6 }}>{p.store}</td>
              <td style={{ padding: 6 }}>{p.name}</td>
              <td style={{ padding: 6 }}>{p.price !== null ? p.price : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

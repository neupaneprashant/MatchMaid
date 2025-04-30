import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

function EarningsChart({ earningsData }) {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <h2>Monthly Earnings</h2>
      <ResponsiveContainer>
        <LineChart data={earningsData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="amount" stroke="#04AA6D" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default EarningsChart;

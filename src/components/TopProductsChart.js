import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const TopProductsChart = ({ data }) => (
  <div>
    <h3>Top-Selling Products</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="_id" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="totalSold" fill="#4f46e5" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default TopProductsChart;



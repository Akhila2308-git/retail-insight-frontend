import React, { useEffect, useState } from "react";
import { getProducts } from "../api/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

function Dashboard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then(setProducts).catch((err) => console.error(err));
  }, []);

  if (!products.length) return <p>Loading...</p>;

  // Prepare data
  const revenueData = products.map((p) => ({
    name: p.name,
    revenue: p.price * p.sold,
  }));

  const stockData = products.map((p) => ({
    name: p.name,
    stock: p.stock,
  }));

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Retail Insight Dashboard</h2>

      <h3>Top 5 Products by Revenue</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={revenueData.slice(0, 5)} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="revenue" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      <h3>Stock Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={stockData}
            dataKey="stock"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#82ca9d"
            label
          >
            {stockData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"][index % 5]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Dashboard;









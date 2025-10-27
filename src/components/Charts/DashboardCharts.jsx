import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DashboardCharts = ({ topProductsData, revenueData, lowStockData }) => {
  return (
    <div style={{ display: "grid", gap: "40px" }}>
      <div style={{ background: "#f9f9f9", padding: "20px", borderRadius: "10px" }}>
        <h3 style={{ textAlign: "center" }}>Top Selling Products</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topProductsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: "#f9f9f9", padding: "20px", borderRadius: "10px" }}>
        <h3 style={{ textAlign: "center" }}>Revenue Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: "#f9f9f9", padding: "20px", borderRadius: "10px" }}>
        <h3 style={{ textAlign: "center" }}>Low Stock Products</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#e0e0e0" }}>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Product</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Stock</th>
            </tr>
          </thead>
          <tbody>
            {lowStockData.map((item, index) => (
              <tr key={index}>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>{item.name}</td>
                <td style={{ padding: "10px", border: "1px solid #ccc", textAlign: "center" }}>{item.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardCharts;



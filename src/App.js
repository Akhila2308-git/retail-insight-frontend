import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./App.css";

// ✅ Backend API link
const API = axios.create({
  baseURL: "https://retail-insightbackend-2.onrender.com",
});

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/api/products")
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("❌ Failed to load data from server");
        setLoading(false);
      });
  }, []);

  // Loading screen
  if (loading)
    return <h2 className="loading">⏳ Loading data, please wait...</h2>;

  // Error message
  if (error)
    return <h2 className="error">{error}</h2>;

  return (
    <div className="dashboard">
      <h1>Retail Insight Dashboard</h1>

      <div className="charts">
        {/* ---------- BAR CHART ---------- */}
        <div className="chart-box">
          <h3>📊 Sales Overview (Bar Chart)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={products}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sold" fill="#82ca9d" name="Sold Items" />
              <Bar dataKey="stock" fill="#8884d8" name="Stock" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ---------- LINE CHART ---------- */}
        <div className="chart-box">
          <h3>📈 Sales Trend (Line Chart)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={products}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sold" stroke="#82ca9d" name="Sold" />
              <Line type="monotone" dataKey="stock" stroke="#8884d8" name="Stock" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default App;


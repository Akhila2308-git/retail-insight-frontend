import React, { useEffect, useState } from "react";
import API from "../api"; // Import API file
import "./Dashboard.css"; // Optional CSS file for styling

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch product data from backend
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

  if (loading) return <h2>⏳ Loading data...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div className="dashboard">
      <h1>Retail Insight Dashboard 📊</h1>
      <div className="product-grid">
        {products.map((p) => (
          <div key={p._id} className="product-card">
            <h3>{p.name}</h3>
            <p>💰 Price: ₹{p.price}</p>
            <p>📦 Stock: {p.stock}</p>
            <p>🛒 Sold: {p.sold}</p>
            <p>⚠️ Reorder Level: {p.reorderLevel}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;










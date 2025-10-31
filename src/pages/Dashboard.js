import React, { useEffect, useState } from "react";
import API from "../api"; // ✅ make sure path is correct
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products"); // ✅ correct endpoint
        setProducts(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <p>Loading product data...</p>;
  if (!products.length) return <p>No products found...</p>;

  const totalRevenue = products.reduce((sum, p) => sum + p.price * p.sold, 0);
  const totalItemsSold = products.reduce((sum, p) => sum + p.sold, 0);
  const inventoryValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  const topProducts = [...products]
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📊 Dashboard Insights</h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-2xl shadow text-center">
          <h3 className="text-lg font-semibold">Total Revenue</h3>
          <p className="text-2xl font-bold">₹{totalRevenue}</p>
        </div>

        <div className="bg-pink-100 p-4 rounded-2xl shadow text-center">
          <h3 className="text-lg font-semibold">Total Items Sold</h3>
          <p className="text-2xl font-bold">{totalItemsSold}</p>
        </div>

        <div className="bg-green-100 p-4 rounded-2xl shadow text-center">
          <h3 className="text-lg font-semibold">Inventory Value</h3>
          <p className="text-2xl font-bold">₹{inventoryValue}</p>
        </div>
      </div>

      {/* Top 5 Products by Sales */}
      <h3 className="text-xl font-bold mb-2">Top 5 Products by Sales</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={topProducts}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="sold" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>

      {/* Revenue Trends */}
      <h3 className="text-xl font-bold mt-8 mb-2">Revenue Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={topProducts}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#22c55e" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Dashboard;



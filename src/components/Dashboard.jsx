import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [data, setData] = useState({
    topProducts: [],
    revenueTrends: [],
    lowStock: [],
  });

  // Fetch dashboard data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/dashboard");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchData();
  }, []);

  // Calculate KPI values
  const totalRevenue = data.revenueTrends.reduce(
    (sum, item) => sum + (item.revenue || 0),
    0
  );
  const totalItemsSold = data.topProducts.reduce(
    (sum, item) => sum + (item.sales || 0),
    0
  );
  const inventoryValue = data.lowStock.reduce(
    (sum, item) => sum + (item.stock || 0) * 100,
    0
  );

  // Export dashboard to PDF
  const exportToPDF = () => {
    const input = document.getElementById("dashboard-content");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("dashboard_report.pdf");
    });
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        📊 Dashboard Insights
      </h1>

      {/* Download PDF Button */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          onClick={exportToPDF}
          style={{
            backgroundColor: "#1976d2",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Download Report 📄
        </button>
      </div>

      {/* Dashboard Content */}
      <div id="dashboard-content">
        {/* KPI Summary Cards */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginBottom: "30px",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          <div
            style={{
              background: "#e3f2fd",
              padding: "20px",
              borderRadius: "12px",
              width: "250px",
              textAlign: "center",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h3>Total Revenue</h3>
            <h2>₹{totalRevenue}</h2>
          </div>

          <div
            style={{
              background: "#f3e5f5",
              padding: "20px",
              borderRadius: "12px",
              width: "250px",
              textAlign: "center",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h3>Total Items Sold</h3>
            <h2>{totalItemsSold}</h2>
          </div>

          <div
            style={{
              background: "#e8f5e9",
              padding: "20px",
              borderRadius: "12px",
              width: "250px",
              textAlign: "center",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h3>Inventory Value</h3>
            <h2>₹{inventoryValue}</h2>
          </div>
        </div>

        {/* Top Products Chart */}
        <div style={{ marginBottom: "40px" }}>
          <h3>Top 5 Products by Sales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Trends Chart */}
        <div style={{ marginBottom: "40px" }}>
          <h3>Revenue Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.revenueTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#388e3c"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Low Stock Table */}
        <div>
          <h3>Products Below Reorder Level</h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "white",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#1976d2", color: "white" }}>
                <th style={{ padding: "10px" }}>Product</th>
                <th style={{ padding: "10px" }}>Stock</th>
              </tr>
            </thead>
            <tbody>
              {data.lowStock.map((item, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom: "1px solid #ddd",
                    textAlign: "center",
                  }}
                >
                  <td style={{ padding: "10px" }}>{item.name}</td>
                  <td style={{ padding: "10px" }}>{item.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

// src/components/Insights.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable"; // make sure this is installed

// Replace baseURL if your backend is hosted. Example you gave earlier:
// const API = axios.create({ baseURL: "https://retail-insightbackend-2.onrender.com" });
const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASEURL || "http://localhost:5000",
});

function formatCurrency(num) {
  if (num === null || num === undefined || Number.isNaN(Number(num))) return "₹0";
  return "₹" + Number(num).toLocaleString();
}

export default function Insights() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/products"); // change if your endpoint differs
      // If your API returns an object like { products: [...] } adapt accordingly
      const data = Array.isArray(res.data) ? res.data : (res.data && Array.isArray(res.data.products) ? res.data.products : []);
      setProducts(data);
    } catch (err) {
      console.error("Fetch products error:", err);
      setError("Failed to fetch products. Check backend URL / CORS / network.");
      setProducts([]); // keep UI safe
    } finally {
      setLoading(false);
    }
  }

  // Calculate KPIs defensively
  const totalRevenue = products.reduce((acc, p) => {
    const price = Number(p?.price) || 0;
    const sold = Number(p?.sold) || 0;
    return acc + price * sold;
  }, 0);

  const totalItemsSold = products.reduce((acc, p) => acc + (Number(p?.sold) || 0), 0);

  const inventoryValue = products.reduce((acc, p) => {
    const price = Number(p?.price) || 0;
    const stock = Number(p?.stock) || 0;
    return acc + price * stock;
  }, 0);

  // Top 5 by revenue
  const productsWithRevenue = products.map((p) => ({
    ...p,
    revenue: (Number(p?.price) || 0) * (Number(p?.sold) || 0),
  }));
  const top5 = productsWithRevenue.slice().sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  // Below reorder level
  const belowReorder = products.filter((p) => {
    const stock = Number(p?.stock) || 0;
    const reorder = Number(p?.reorderLevel) || 0;
    return stock <= reorder;
  });

  function exportPDF() {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Retail Insights Report", 14, 20);
    doc.setFontSize(11);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

    doc.setFontSize(12);
    doc.text("Key Performance Indicators:", 14, 36);
    doc.setFontSize(10);
    doc.text(`Total revenue: ${formatCurrency(totalRevenue)}`, 14, 42);
    doc.text(`Total items sold: ${totalItemsSold}`, 14, 48);
    doc.text(`Inventory value: ${formatCurrency(inventoryValue)}`, 14, 54);

    // Top 5 table
    doc.setFontSize(12);
    const top5StartY = 62;
    doc.text("Top 5 Products by Revenue", 14, top5StartY);

    const top5Columns = [["Name", "Price", "Sold", "Revenue"]];
    const top5Rows = top5.map((p) => [
      p?.name || "-",
      p?.price != null ? String(p.price) : "-",
      p?.sold != null ? String(p.sold) : "-",
      (p?.revenue != null ? Number(p.revenue).toFixed(2) : "0"),
    ]);

    doc.autoTable({
      head: top5Columns,
      body: top5Rows,
      startY: top5StartY + 4,
      styles: { fontSize: 9 },
      theme: "grid",
      margin: { left: 14, right: 14 },
    });

    // After top5 table
    const afterTop5Y = (doc.lastAutoTable && doc.lastAutoTable.finalY) ? doc.lastAutoTable.finalY + 8 : top5StartY + 40;
    doc.setFontSize(12);
    doc.text("Products Below Reorder Level", 14, afterTop5Y);

    const belowCols = [["Name", "Stock", "Reorder Level", "Price"]];
    const belowRows = belowReorder.map((p) => [
      p?.name || "-",
      p?.stock != null ? String(p.stock) : "-",
      p?.reorderLevel != null ? String(p.reorderLevel) : "-",
      p?.price != null ? String(p.price) : "-",
    ]);

    doc.autoTable({
      head: belowCols,
      body: belowRows,
      startY: afterTop5Y + 4,
      styles: { fontSize: 9 },
      theme: "grid",
      margin: { left: 14, right: 14 },
    });

    doc.save("retail-insights-report.pdf");
  }

  return (
    <div style={{ padding: 18 }}>
      <h2>Week 3 — Insights & Reporting</h2>

      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <>
          <div style={styles.kpiRow}>
            <div style={styles.card}>
              <h4 style={{ margin: 0 }}>Total revenue</h4>
              <p style={{ fontSize: 20, margin: "8px 0 0" }}>{formatCurrency(totalRevenue)}</p>
            </div>

            <div style={styles.card}>
              <h4 style={{ margin: 0 }}>Total items sold</h4>
              <p style={{ fontSize: 20, margin: "8px 0 0" }}>{totalItemsSold}</p>
            </div>

            <div style={styles.card}>
              <h4 style={{ margin: 0 }}>Inventory value</h4>
              <p style={{ fontSize: 20, margin: "8px 0 0" }}>{formatCurrency(inventoryValue)}</p>
            </div>
          </div>

          <section style={{ marginTop: 18 }}>
            <h3>Top 5 Products by Revenue</h3>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Sold</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {top5.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>No data</td>
                  </tr>
                )}
                {top5.map((p, i) => (
                  <tr key={(p._id || p.name) + i}>
                    <td>{i + 1}</td>
                    <td>{p?.name}</td>
                    <td>{formatCurrency(p?.price)}</td>
                    <td>{p?.sold ?? 0}</td>
                    <td>{formatCurrency(p?.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section style={{ marginTop: 18 }}>
            <h3>Products Below Reorder Level</h3>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Stock</th>
                  <th>Reorder Level</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {belowReorder.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>No products below reorder level</td>
                  </tr>
                )}
                {belowReorder.map((p, i) => (
                  <tr key={(p._id || p.name) + i}>
                    <td>{i + 1}</td>
                    <td>{p?.name}</td>
                    <td>{p?.stock ?? "-"}</td>
                    <td>{p?.reorderLevel ?? "-"}</td>
                    <td>{formatCurrency(p?.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <div style={{ marginTop: 18 }}>
            <button onClick={exportPDF} style={styles.button}>Export Report as PDF</button>
            <button onClick={fetchProducts} style={{ ...styles.button, marginLeft: 8 }}>Refresh Data</button>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  kpiRow: { display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" },
  card: {
    minWidth: 180,
    padding: 12,
    borderRadius: 8,
    boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
    background: "#fff",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  button: {
    padding: "8px 14px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    background: "#2563eb",
    color: "#fff",
  },
};

import React, { useEffect, useState } from "react";
import { getProducts } from "../api/api";
import jsPDF from "jspdf";
import "jspdf-autotable";

function Insights() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then(setProducts).catch((err) => console.error(err));
  }, []);

  if (!products.length) return <p>Loading...</p>;

  // KPIs
  const totalRevenue = products.reduce((sum, p) => sum + p.price * p.sold, 0);
  const totalSold = products.reduce((sum, p) => sum + p.sold, 0);
  const inventoryValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const belowReorder = products.filter((p) => p.stock < p.reorderLevel);

  // PDF Report
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Retail Insight Report", 14, 15);
    doc.autoTable({
      startY: 25,
      head: [["Name", "Price", "Stock", "Sold", "Revenue"]],
      body: products.map((p) => [
        p.name,
        p.price,
        p.stock,
        p.sold,
        p.price * p.sold,
      ]),
    });
    doc.save("retail_insight_report.pdf");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>💡 Insights & Reporting</h2>

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div><strong>Total Revenue:</strong> ₹{totalRevenue}</div>
        <div><strong>Total Items Sold:</strong> {totalSold}</div>
        <div><strong>Inventory Value:</strong> ₹{inventoryValue}</div>
      </div>

      <h3>Products Below Reorder Level</h3>
      <ul>
        {belowReorder.map((p) => (
          <li key={p._id}>
            {p.name} — Stock: {p.stock}, Reorder Level: {p.reorderLevel}
          </li>
        ))}
      </ul>

      <button onClick={exportPDF} style={{ marginTop: "20px", padding: "10px" }}>
        📄 Export Report as PDF
      </button>
    </div>
  );
}

export default Insights;



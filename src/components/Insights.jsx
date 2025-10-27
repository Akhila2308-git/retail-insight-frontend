import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const InsightsDashboard = () => {
  const [insights, setInsights] = useState({
    totalRevenue: 0,
    totalItemsSold: 0,
    inventoryValue: 0,
    topProducts: [],
  });

  useEffect(() => {
    // ✅ Fetch insights data from backend API
    fetch("http://localhost:5000/api/insights")
      .then((res) => res.json())
      .then((data) => setInsights(data))
      .catch((err) => console.error("Error fetching insights:", err));
  }, []);

  // ✅ Function to generate and download PDF
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Retail Insight System - Insights Report", 14, 15);

    doc.setFontSize(12);
    doc.text(`Total Revenue: ₹${insights.totalRevenue}`, 14, 30);
    doc.text(`Total Items Sold: ${insights.totalItemsSold}`, 14, 38);
    doc.text(`Inventory Value: ₹${insights.inventoryValue}`, 14, 46);

    if (insights.topProducts && insights.topProducts.length > 0) {
      const tableColumn = ["Product", "Revenue (₹)", "Quantity Sold"];
      const tableRows = insights.topProducts.map((p) => [
        p.name,
        p.revenue,
        p.quantitySold,
      ]);

      autoTable(doc, {
        startY: 60,
        head: [tableColumn],
        body: tableRows,
      });
    } else {
      doc.text("No product data available.", 14, 60);
    }

    doc.save("Insights_Report.pdf");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Insights Dashboard</h1>

      <div>
        <p><strong>Total Revenue:</strong> ₹{insights.totalRevenue}</p>
        <p><strong>Total Items Sold:</strong> {insights.totalItemsSold}</p>
        <p><strong>Inventory Value:</strong> ₹{insights.inventoryValue}</p>
      </div>

      <h3>Top Products</h3>
      {insights.topProducts && insights.topProducts.length > 0 ? (
        <table border="1" cellPadding="5" cellSpacing="0">
          <thead>
            <tr>
              <th>Product</th>
              <th>Revenue (₹)</th>
              <th>Quantity Sold</th>
            </tr>
          </thead>
          <tbody>
            {insights.topProducts.map((p, index) => (
              <tr key={index}>
                <td>{p.name}</td>
                <td>{p.revenue}</td>
                <td>{p.quantitySold}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No product data available.</p>
      )}

      {/* ✅ Button for PDF download */}
      <button
        onClick={downloadPDF}
        style={{
          marginTop: "20px",
          padding: "10px 15px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Download PDF Report
      </button>
    </div>
  );
};

export default InsightsDashboard;

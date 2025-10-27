// 📄 src/components/PDFReport.js

import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const PDFReport = () => {
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Insights Report", 14, 15);

    // Example data
    const tableColumn = ["Name", "Age", "City"];
    const tableRows = [
      ["Alekhya", "22", "Hyderabad"],
      ["Priya", "23", "Chennai"],
      ["Ananya", "24", "Bangalore"],
    ];

    // Add table
    doc.autoTable({
      startY: 25,
      head: [tableColumn],
      body: tableRows,
    });

    // Save PDF
    doc.save("Insights_Report.pdf");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>Download PDF Example</h2>
      <button
        onClick={downloadPDF}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Download PDF
      </button>
    </div>
  );
};

export default PDFReport;

import React, { useState, useEffect } from "react";
import api from "../services/api";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [sales, setSales] = useState([]);

  // Fetch sales when page loads
  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await api.get("/api/sales");
      setSales(res.data);
    } catch (err) {
      console.error("Failed to fetch sales:", err);
    }
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a CSV file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/api/sales/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(res.data.message);
      fetchSales(); // refresh table after upload
    } catch (err) {
      setMessage("Upload failed. Try again.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>📊 Upload & View Sales Data</h2>

      <input type="file" accept=".csv" onChange={handleFileChange} style={{ margin: "20px" }} />
      <br />
      <button onClick={handleUpload} style={{ padding: "10px 20px" }}>
        Upload CSV
      </button>
      <p style={{ marginTop: "20px", color: "green" }}>{message}</p>

      <h3 style={{ marginTop: "40px" }}>Uploaded Sales Records</h3>

      {sales.length > 0 ? (
        <table
          border="1"
          style={{
            margin: "auto",
            marginTop: "20px",
            borderCollapse: "collapse",
            width: "80%",
            textAlign: "center",
          }}
        >
          <thead>
            <tr style={{ background: "#ddd" }}>
              <th>Product Name</th>
              <th>Quantity Sold</th>
              <th>Sale Date</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((s, i) => (
              <tr key={i}>
                <td>{s.productName}</td>
                <td>{s.quantitySold}</td>
                <td>{new Date(s.saleDate).toLocaleDateString()}</td>
                <td>{s.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No sales data found yet.</p>
      )}
    </div>
  );
}

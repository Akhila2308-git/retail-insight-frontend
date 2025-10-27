import React from "react";

const LowStockTable = ({ data }) => (
  <div>
    <h3>Low Stock Items</h3>
    <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Stock Quantity</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan="2" style={{ textAlign: "center" }}>No low stock items</td>
          </tr>
        ) : (
          data.map((item, i) => (
            <tr key={i}>
              <td>{item.productName}</td>
              <td>{item.stockQuantity}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default LowStockTable;



import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Insights from "./components/Insights";

function App() {
  return (
    <Router>
      <div
        style={{
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f7f8fc",
          minHeight: "100vh",
        }}
      >
        {/* Navbar */}
        <nav
          style={{
            backgroundColor: "#212121",
            color: "white",
            padding: "15px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          }}
        >
          <h2 style={{ margin: 0 }}>Retail Insight System</h2>
          <div>
            <Link
              to="/dashboard"
              style={{
                color: "white",
                textDecoration: "none",
                marginRight: "20px",
                fontWeight: "bold",
              }}
            >
              Dashboard
            </Link>
            <Link
              to="/insights"
              style={{
                color: "white",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Insights
            </Link>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/insights" element={<Insights />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

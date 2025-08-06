import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Form from "./components/Form";
import AllUsers from "./components/AllUsers";
import "./App.css";
import logo from "./assets/logo.jpeg";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="container">
            <div className="header" style={{ textAlign: "center", marginBottom: "30px", padding: "20px 0" }}>
              <img
                src={logo}
                alt="Logo"
                style={{
                  width: "90px",
                  height: "90px",
                  objectFit: "contain",
                  margin: "0 auto 18px auto",
                  display: "block",
                  borderRadius: "12px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)"
                }}
              />
              <h1 style={{ color: "#333", marginBottom: "10px", fontSize: "2rem" }}>
                Registration Form
              </h1>
              <p style={{ color: "#666", fontSize: "1.1rem", margin: 0 }}>
                Please fill out the form below to register
              </p>
            </div>
            <Form />
          </div>
        } />
        <Route path="/allUsers" element={<AllUsers />} />
      </Routes>
    </Router>
  );
}

export default App;

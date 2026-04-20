import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Home from './pages/Home';
import Admin from "./pages/Admin";
import Community from "./pages/Community";
import TradeRequests from "./pages/TradeRequests.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot_password" element={<ForgotPassword />} />
          <Route path="/home" element={<Home />} />
          <Route path="/community" element={<Community />} />
          <Route path="/trade-requests" element={<TradeRequests />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

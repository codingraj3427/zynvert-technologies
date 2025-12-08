// src/pages/Admin/AdminLayout.jsx
import React from "react";
import { NavLink, Routes, Route } from "react-router-dom";

import AdminDashboardPage from "./AdminDashboardPage";
import AdminProductsPage from "./AdminProductsPage";
import AdminOrdersPage from "./AdminOrdersPage";
import AdminCustomersPage from "./AdminCustomersPage";

import "./admin.css"; // optional; create for styling

const AdminSidebar = () => (
  <aside className="admin-sidebar">
    <h2 className="admin-logo">Admin</h2>
    <nav>
      <NavLink end to="/admin" className="admin-nav-link">
        Dashboard
      </NavLink>
      <NavLink to="/admin/products" className="admin-nav-link">
        Products
      </NavLink>
      <NavLink to="/admin/orders" className="admin-nav-link">
        Orders
      </NavLink>
      <NavLink to="/admin/customers" className="admin-nav-link">
        Customers
      </NavLink>
    </nav>
  </aside>
);

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <section className="admin-main">
        <header className="admin-topbar">
          <h1>Admin Panel</h1>
        </header>
        <div className="admin-content">
          <Routes>
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
          </Routes>
        </div>
      </section>
    </div>
  );
};

export default AdminLayout;

// src/pages/Admin/AdminDashboardPage.jsx
import React, { useEffect, useState } from "react";
import { adminService } from "../../services/admin.service";

const AdminDashboardPage = () => {
  const [overview, setOverview] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [overviewRes, topProductsRes] = await Promise.all([
        adminService.getOverview(),
        adminService.getTopProducts({ limit: 5 }),
      ]);

      setOverview(overviewRes || {});
      setTopProducts(topProductsRes?.items || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  const revenue = overview?.revenue || {};
  const orders = overview?.orders || {};
  const customers = overview?.customers || {};

  const totalRevenue = Number(revenue.totalRevenue || 0);
  const averageOrderValue = Number(revenue.averageOrderValue || 0);
  const totalOrders = Number(orders.totalOrders || 0);
  const paidOrders = Number(orders.paidOrders || 0);
  const totalCustomers = Number(customers.totalCustomers || 0);
  const newCustomersInRange = Number(customers.newCustomersInRange || 0);

  return (
    <div className="admin-dashboard-page">
      {/* ===== Top hero header ===== */}
      <div className="admin-dashboard-header">
        <div>
          <h2 className="admin-dashboard-title">Welcome back 👋</h2>
          <p className="admin-dashboard-subtitle">
            Here&apos;s a quick overview of how your store is performing.
          </p>
        </div>

        <div className="admin-dashboard-actions">
          <div className="admin-dashboard-search">
            <input
              type="text"
              placeholder="Search orders, customers..."
            />
          </div>
          <button className="admin-icon-btn" type="button">
            🔔
          </button>
          <div className="admin-user-pill">
            <div className="admin-user-avatar">A</div>
            <div className="admin-user-meta">
              <span className="admin-user-name">Admin</span>
              <span className="admin-user-role">Store Owner</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Metric cards ===== */}
      <div className="admin-dashboard-metrics">
        <div className="metric-card metric-card--purple">
          <div className="metric-label">Total Revenue</div>
          <div className="metric-value">₹{totalRevenue.toFixed(2)}</div>
          <div className="metric-caption">Last 30 days</div>
        </div>

        <div className="metric-card metric-card--blue">
          <div className="metric-label">Average Order Value</div>
          <div className="metric-value">
            ₹{averageOrderValue.toFixed(2)}
          </div>
          <div className="metric-caption">
            {totalOrders} orders in this range
          </div>
        </div>

        <div className="metric-card metric-card--green">
          <div className="metric-label">Orders</div>
          <div className="metric-value">
            {paidOrders} / {totalOrders}
          </div>
          <div className="metric-caption">Paid / Total</div>
        </div>

        <div className="metric-card metric-card--orange">
          <div className="metric-label">Customers</div>
          <div className="metric-value">{totalCustomers}</div>
          <div className="metric-caption">
            {newCustomersInRange} new in this period
          </div>
        </div>
      </div>

      {/* ===== Main content 2-column layout ===== */}
      <div className="admin-dashboard-main">
        <div className="admin-dashboard-col">
          <div className="admin-card admin-dashboard-card">
            <div className="admin-dashboard-card-header">
              <div>
                <h3>Sales snapshot</h3>
                <p className="admin-dashboard-card-subtitle">
                  Revenue and orders across the selected period.
                </p>
              </div>
              <div className="admin-dashboard-range-pill">
                Last 30 days ▼
              </div>
            </div>

            {/* Simple placeholder “chart” blocks */}
            <div className="sales-bars">
              {[20, 40, 55, 35, 75, 60, 45].map((h, idx) => (
                <div
                  key={idx}
                  className="sales-bar"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="sales-bars-label">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          <div className="admin-card admin-dashboard-card">
            <h3 style={{ marginTop: 0, marginBottom: "0.5rem" }}>
              Top products (by revenue)
            </h3>
            <table className="admin-table compact">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Qty sold</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.length > 0 ? (
                  topProducts.map((p) => (
                    <tr key={p.product_id}>
                      <td>{p.name || p.product_id}</td>
                      <td>{p.sku || "-"}</td>
                      <td>{p.totalQuantity ?? 0}</td>
                      <td>
                        ₹{Number(p.totalRevenue || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4}>
                      No products sold in this period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-dashboard-col admin-dashboard-col--side">
          <div className="admin-card admin-dashboard-card">
            <h3 style={{ marginTop: 0 }}>Quick snapshot</h3>
            <ul className="dashboard-list">
              <li>
                <span>Pending orders</span>
                <span className="badge badge-warning">
                  {orders.pendingOrders || 0}
                </span>
              </li>
              <li>
                <span>Cancelled orders</span>
                <span className="badge badge-danger">
                  {orders.cancelledOrders || 0}
                </span>
              </li>
              <li>
                <span>Active customers</span>
                <span className="badge badge-success">
                  {customers.distinctCustomersInRange || 0}
                </span>
              </li>
            </ul>
          </div>

          <div className="admin-card admin-dashboard-card">
            <h3 style={{ marginTop: 0 }}>System status</h3>
            <p className="admin-dashboard-card-subtitle">
              Everything looks healthy. You can safely manage products and
              orders.
            </p>
            <ul className="dashboard-list">
              <li>
                <span>API</span>
                <span className="badge badge-success">Operational</span>
              </li>
              <li>
                <span>PostgreSQL</span>
                <span className="badge badge-success">Connected</span>
              </li>
              <li>
                <span>MongoDB</span>
                <span className="badge badge-success">Connected</span>
              </li>
              <li>
                <span>Firebase</span>
                <span className="badge badge-success">
                  Events streaming
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

// src/pages/Admin/AdminOrdersPage.jsx
import React, { useEffect, useState } from "react";
import { adminService } from "../../services/admin.service";

const statusBadgeClass = (status) => {
  if (!status) return "";
  const s = status.toLowerCase();
  if (s.includes("paid")) return "badge badge-success";
  if (s.includes("pending")) return "badge badge-warning";
  if (s.includes("cancel")) return "badge badge-danger";
  return "badge";
};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      setError("");
      const data = await adminService.getOrders();
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load orders");
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      await adminService.updateOrderStatus(orderId, newStatus);
      await loadOrders();
    } catch (err) {
      console.error(err);
      setError("Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <h2>Orders</h2>
      </div>

      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Order #</th>
            <th>Date</th>
            <th>Customer</th>
            <th>City</th>
            <th>Total (₹)</th>
            <th>Status</th>
            <th>Change Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.order_id}>
              <td>{o.order_id}</td>
              <td>
                {o.createdAt
                  ? new Date(o.createdAt).toLocaleString()
                  : "-"}
              </td>
              <td>{o.shipping_name || o.customer_name}</td>
              <td>{o.shipping_city}</td>
              <td>{o.total_amount}</td>
              <td>
                <span className={statusBadgeClass(o.status)}>{o.status}</span>
              </td>
              <td>
                <select
                  value={o.status}
                  disabled={updatingId === o.order_id}
                  onChange={(e) =>
                    handleStatusChange(o.order_id, e.target.value)
                  }
                >
                  <option value="Pending Payment">Pending Payment</option>
                  <option value="Paid">Paid</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan={7}>No orders found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrdersPage;

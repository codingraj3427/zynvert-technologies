// src/pages/Admin/AdminCustomersPage.jsx
import React, { useEffect, useState } from "react";
import { adminService } from "../../services/admin.service";

const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");

  const loadCustomers = async () => {
    try {
      setError("");
      const data = await adminService.getCustomers();
      setCustomers(Array.isArray(data) ? data : data.customers || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load customers");
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  return (
    <div>
      <div className="admin-page-header">
        <h2>Customers</h2>
      </div>

      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}

      <table className="admin-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.user_id}>
              <td>{c.user_id}</td>
              <td>
                {c.first_name} {c.last_name}
              </td>
              <td>{c.email}</td>
              <td>{c.phone_number}</td>
              <td>
                {c.createdAt
                  ? new Date(c.createdAt).toLocaleDateString()
                  : "-"}
              </td>
            </tr>
          ))}
          {customers.length === 0 && (
            <tr>
              <td colSpan={5}>No customers found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCustomersPage;

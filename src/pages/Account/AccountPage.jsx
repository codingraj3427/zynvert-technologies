import React, { useState } from "react";
// Assuming you have UserIcon, HeartIcon, BoxIcon (for orders), etc.
import UserIcon from "../../assets/icons/UserIcon"; 
import HeartIcon from "../../assets/icons/HeartIcon";
// Note: You will need to implement icons for Orders (e.g., BoxIcon) and Address (e.g., HomeIcon)

// ======== NESTED COMPONENTS (Placeholders) ========

const AccountDashboard = () => (
  <div className="account-section">
    <h3>Account Overview</h3>
    <p>Welcome back! Here is a summary of your recent activity.</p>
    <div className="dashboard-grid">
      <div className="summary-card">
        <h4>Recent Orders</h4>
        <p>You have 1 order currently in transit.</p>
        <a href="#orders">View all orders →</a>
      </div>
      <div className="summary-card">
        <h4>Wishlist</h4>
        <p>You have 5 items saved for later.</p>
        <a href="#favorites">Go to Favorites →</a>
      </div>
      <div className="summary-card">
        <h4>Saved Addresses</h4>
        <p>3 addresses saved.</p>
        <a href="#addresses">Manage addresses →</a>
      </div>
    </div>
  </div>
);

const AccountProfile = () => (
  <div className="account-section">
    <h3>Personal Information</h3>
    <p>Update your name, email, phone number, and password here.</p>
    {/* Placeholder for the main update form */}
    <form className="profile-form">
      <div className="form-group">
        <label htmlFor="firstName">First Name</label>
        <input type="text" id="firstName" defaultValue="Raj" />
      </div>
      <div className="form-group">
        <label htmlFor="lastName">Last Name</label>
        <input type="text" id="lastName" defaultValue="Chakraborty" />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" defaultValue="user@zynvert.com" disabled />
      </div>
      <div className="form-group">
        <label htmlFor="phone">Phone Number</label>
        <input type="tel" id="phone" defaultValue="+91 98765 43210" />
      </div>
      <button type="submit" className="auth-btn">Save Changes</button>
    </form>
    
    <h4 style={{marginTop: '30px'}}>Change Password</h4>
    {/* Placeholder for change password form */}
  </div>
);

const AccountOrders = () => (
  <div className="account-section">
    <h3>Order History</h3>
    <p>Track, return, or view details for all your past orders.</p>
    {/* Placeholder for order list with tracking status */}
    <div className="order-list">
        <div className="order-item">#1001 - Delivered (2025-11-20)</div>
        <div className="order-item">#1002 - Shipped (Expected: 2025-12-10)</div>
    </div>
  </div>
);

const AccountAddresses = () => (
  <div className="account-section">
    <h3>Saved Addresses</h3>
    <p>Add, edit, or remove your primary delivery addresses.</p>
    {/* Placeholder for address list */}
    <div className="address-list">
        <div className="address-card">Home: 123 Main St, Kolkata, 700001</div>
        <div className="address-card">Work: 456 Tech Park, Kolkata, 700091</div>
    </div>
    <button className="secondary-btn" style={{marginTop: '15px'}}>+ Add New Address</button>
  </div>
);


// ======== MAIN ACCOUNT PAGE COMPONENT ========

const AccountPage = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AccountDashboard />;
      case "profile":
        return <AccountProfile />;
      case "orders":
        return <AccountOrders />;
      case "addresses":
        return <AccountAddresses />;
      case "favorites":
        // Navigate away to the Favorites page implemented elsewhere
        onNavigate('favorites'); 
        return null; 
      default:
        return <AccountDashboard />;
    }
  };

  return (
    <div className="account-page section-reveal">
      <h1>My Account</h1>

      <div className="account-layout">
        <aside className="account-sidebar">
          <nav>
            <button
              className={activeTab === "dashboard" ? "active" : ""}
              onClick={() => setActiveTab("dashboard")}
            >
              <i className="fas fa-home"></i> Dashboard
            </button>
            <button
              className={activeTab === "profile" ? "active" : ""}
              onClick={() => setActiveTab("profile")}
            >
              <UserIcon /> Personal Profile
            </button>
            <button
              className={activeTab === "orders" ? "active" : ""}
              onClick={() => setActiveTab("orders")}
            >
              <i className="fas fa-box-open"></i> My Orders
            </button>
            <button
              className={activeTab === "addresses" ? "active" : ""}
              onClick={() => setActiveTab("addresses")}
            >
              <i className="fas fa-map-marker-alt"></i> Addresses
            </button>
            <button
              className={activeTab === "favorites" ? "active" : ""}
              onClick={() => onNavigate('favorites')}
            >
              <HeartIcon /> Favorites
            </button>
          </nav>
        </aside>

        <section className="account-content">
          {renderContent()}
        </section>
      </div>
    </div>
  );
};

export default AccountPage;
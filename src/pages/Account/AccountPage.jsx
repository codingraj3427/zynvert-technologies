import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { profileService } from '../../services/profile.service'; 

// Assuming you have icons
import UserIcon from "../../assets/icons/UserIcon"; 
import HeartIcon from "../../assets/icons/HeartIcon";

// ⭐️ Static List of Indian States (for Datalist/Dropdown)
const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", 
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", 
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

// ===============================================
// 🎯 Pincode Lookup API Function (Returns Status)
// ===============================================

const fetchLocationByPincode = async (pincode) => {
    if (pincode.length !== 6) {
        return { city: '', state: '', status: 'pending' };
    }
    
    try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        
        if (!response.ok) {
            throw new Error('Pincode API failed with status: ' + response.status);
        }

        const data = await response.json();
        
        if (data && data[0].Status === 'Success' && data[0].PostOffice.length > 0) {
            const postOffice = data[0].PostOffice[0];
            return {
                city: postOffice.District,
                state: postOffice.State,
                status: 'success'
            };
        }
        
        // Status 'Error' or success with no data found
        return { city: '', state: '', status: 'not_found' }; 

    } catch (error) {
        console.error("Pincode lookup error:", error);
        return { city: '', state: '', status: 'error' };
    }
};


// ===============================================
// 🎯 Reusable Hook for Pincode Lookup (Tracks Error)
// ===============================================

const usePincodeLookup = (pincodeInput) => {
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincodeLookupLoading, setPincodeLookupLoading] = useState(false);
    const [lookupError, setLookupError] = useState(''); 

    useEffect(() => {
        if (pincodeInput.length !== 6) {
            setCity('');
            setState('');
            setLookupError(''); 
            return;
        }

        const lookup = async () => {
            setPincodeLookupLoading(true);
            setLookupError('');

            try {
                const location = await fetchLocationByPincode(pincodeInput);
                
                if (location.status === 'success') {
                    setCity(location.city);
                    setState(location.state);
                    setLookupError('');
                } else {
                    setCity('');
                    setState('');
                    setLookupError('Wrong Pincode. Please check and try again.'); 
                }
            } catch (error) {
                setCity('');
                setState('');
                setLookupError('Location service unavailable.');
            } finally {
                setPincodeLookupLoading(false);
            }
        };

        const timeoutId = setTimeout(lookup, 500); 
        return () => clearTimeout(timeoutId); 
    }, [pincodeInput]);

    return { city, state, pincodeLookupLoading, lookupError };
};


// ===============================================
// ======== NESTED COMPONENTS: ACCOUNT PROFILE (UNCHANGED) ========
// ===============================================

const AccountProfile = ({ userData }) => {
  const [formData, setFormData] = useState({
    firstName: userData.firstName || '',
    lastName: userData.lastName || '',
    phone: userData.phone || '',
    email: userData.email || '', 
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await profileService.updateProfileDetails({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      });
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update failed:", err);
      setMessage("Error: Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-section">
      <h3>Personal Information</h3>
      <p>Update your name, email, phone number, and password here.</p>
      
      {message && <p className="form-message" style={{ color: message.startsWith('Error') ? 'red' : 'green' }}>{message}</p>}

      <form className="profile-form" onSubmit={handleUpdate}>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input type="text" id="firstName" value={formData.firstName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input type="text" id="lastName" value={formData.lastName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={formData.email} disabled /> 
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input type="tel" id="phone" value={formData.phone} onChange={handleChange} />
        </div>
        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};


// ===============================================
// ======== NESTED COMPONENTS: NEW ADDRESS FORM (UPDATED) ========
// ===============================================

const NewAddressForm = ({ onSave }) => {
  const [addressData, setAddressData] = useState({
    name: '', 
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [loading, setLoading] = useState(false);
  
  // Apply Pincode Hook
  const { city: autoCity, state: autoState, pincodeLookupLoading, lookupError } = usePincodeLookup(addressData.pincode);

  useEffect(() => {
      // Auto-populate City and State when lookup completes
      if (autoCity || autoState) {
          setAddressData(prev => ({
              ...prev,
              city: autoCity,
              state: autoState
          }));
      }
  }, [autoCity, autoState]);


  const handleChange = (e) => {
    setAddressData({ ...addressData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (lookupError) {
        alert("Cannot save address due to Pincode error.");
        return;
    }
    setLoading(true);
    try {
      const newAddress = await profileService.saveAddress(addressData);
      onSave(newAddress); 
      setAddressData({ name: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '' }); // Reset form
    } catch (err) {
      console.error("Address save failed:", err);
      alert("Failed to save address. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  // ⭐️ Determine disabled state
  // Disabled if we are loading, have an error, or have valid data AND Pincode is 6 digits long.
  const isCityStateDisabled = !!autoCity || !!lookupError || pincodeLookupLoading || addressData.pincode.length < 6;

  return (
    <form className="profile-form" onSubmit={handleSubmit} style={{maxWidth: '100%', border: '1px dashed #ccc', padding: '20px', borderRadius: '8px'}}>
      <h4>Add New Address</h4>
      
      <div className="form-group">
          <label htmlFor="name">Address Nickname (e.g., Home, Office)</label>
          <input type="text" id="name" value={addressData.name} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="addressLine1">Address Line 1</label>
        <input type="text" id="addressLine1" value={addressData.addressLine1} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="addressLine2">Address Line 2 (Optional)</label>
        <input type="text" id="addressLine2" value={addressData.addressLine2} onChange={handleChange} />
      </div>
      
      {/* ⭐️ FINAL ORDER: Pincode, State, City */}
      <div style={{ display: 'flex', gap: '15px' }}>
          
          <div className="form-group" style={{ flex: 1.5 }}>
            <label htmlFor="pincode">Pincode</label>
            <input 
                type="text" 
                id="pincode" 
                value={addressData.pincode} 
                onChange={handleChange} 
                maxLength="6"
                required 
            />
            {/* ⭐️ Visual Feedback/Error */}
            {pincodeLookupLoading && <small style={{ color: 'var(--accent-color)' }}>Fetching location...</small>}
            {lookupError && <small style={{ color: 'var(--primary-color)' }}>{lookupError}</small>}
          </div>

          <div className="form-group" style={{ flex: 1.5 }}>
            <label htmlFor="state">State</label>
            <input 
                type="text" 
                id="state" 
                list="indian-states" 
                value={addressData.state} 
                onChange={handleChange} 
                required 
                // ⭐️ Disabled when waiting or when data is available/error is present
                disabled={isCityStateDisabled} 
            />
            {/* Datalist provides dropdown suggestions */}
            <datalist id="indian-states">
                {INDIAN_STATES.map(state => (
                    <option key={state} value={state} />
                ))}
            </datalist>
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="city">City</label>
            <input 
                type="text" 
                id="city" 
                value={addressData.city} 
                onChange={handleChange} 
                required 
                // ⭐️ Disabled when waiting or when data is available/error is present
                disabled={isCityStateDisabled} 
            />
          </div>
      </div>
      
      <button type="submit" className="auth-btn" disabled={loading || !!lookupError || !autoCity}>
        {loading ? "Saving Address..." : "Save Address"}
      </button>
    </form>
  );
};


// ===============================================
// ======== NESTED COMPONENTS: EDIT ADDRESS FORM (UPDATED) ========
// ===============================================

const EditAddressForm = ({ address, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: address.fullName || '',
    addressLine1: address.addressLine1 || '',
    addressLine2: address.addressLine2 || '',
    city: address.city || '',
    state: address.state || '',
    pincode: address.pincode || '',
    isDefault: address.isDefault || false,
  });
  const [loading, setLoading] = useState(false);

  // Apply Pincode Hook
  const { city: autoCity, state: autoState, pincodeLookupLoading, lookupError } = usePincodeLookup(formData.pincode);

  useEffect(() => {
      // Auto-populate City and State when lookup completes
      if (autoCity || autoState) {
          setFormData(prev => ({
              ...prev,
              city: autoCity,
              state: autoState
          }));
      }
  }, [autoCity, autoState]);


  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({ ...formData, [id]: type === 'checkbox' ? checked : value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (lookupError) {
        alert("Cannot save address due to Pincode error.");
        return;
    }
    setLoading(true);
    try {
      await profileService.updateAddress(address.id, formData);
      onUpdate(address.id, formData); 
    } catch (err) {
      console.error("Address update failed:", err);
      alert("Failed to update address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ⭐️ Determine disabled state
  const isCityStateDisabled = !!autoCity || !!lookupError || pincodeLookupLoading || formData.pincode.length < 6;


  return (
    <form className="profile-form" onSubmit={handleSubmit} style={{maxWidth: '100%', border: '1px solid var(--primary-color)', padding: '20px', borderRadius: '8px', marginBottom: '20px'}}>
      <h4>Edit Address: {address.fullName}</h4>
      
      <div className="form-group">
        <label htmlFor="fullName">Address Nickname</label>
        <input type="text" id="fullName" value={formData.fullName} onChange={handleChange} required />
      </div>

      <div className="form-group">
          <label htmlFor="addressLine1">Address Line 1</label>
          <input type="text" id="addressLine1" value={formData.addressLine1} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="addressLine2">Address Line 2 (Optional)</label>
        <input type="text" id="addressLine2" value={formData.addressLine2} onChange={handleChange} />
      </div>
      
      {/* ⭐️ FINAL ORDER: Pincode, State, City */}
      <div style={{ display: 'flex', gap: '15px' }}>
          
          <div className="form-group" style={{ flex: 1.5 }}>
            <label htmlFor="pincode">Pincode</label>
            <input 
                type="text" 
                id="pincode" 
                value={formData.pincode} 
                onChange={handleChange} 
                maxLength="6"
                required 
            />
             {/* ⭐️ Visual Feedback/Error */}
             {pincodeLookupLoading && <small style={{ color: 'var(--accent-color)' }}>Fetching location...</small>}
             {lookupError && <small style={{ color: 'var(--primary-color)' }}>{lookupError}</small>}
          </div>

          <div className="form-group" style={{ flex: 1.5 }}>
            <label htmlFor="state">State</label>
            <input 
                type="text" 
                id="state" 
                list="indian-states" // Dropdown
                value={formData.state} 
                onChange={handleChange} 
                required 
                disabled={isCityStateDisabled} 
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="city">City</label>
            <input 
                type="text" 
                id="city" 
                value={formData.city} 
                onChange={handleChange} 
                required 
                disabled={isCityStateDisabled} 
            />
          </div>
      </div>


      <div className="form-group">
          <label>
              <input type="checkbox" id="isDefault" checked={formData.isDefault} onChange={handleChange} style={{marginRight: '10px'}} />
              Set as Default Address
          </label>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
        <button type="submit" className="auth-btn" disabled={loading || !!lookupError || !autoCity} style={{flex: 1}}>
          {loading ? "Saving..." : "Update Address"}
        </button>
        <button type="button" onClick={onCancel} className="secondary-btn" style={{flex: 1, background: '#ccc'}}>
          Cancel
        </button>
      </div>
    </form>
  );
};


// ===============================================
// ======== NESTED COMPONENTS: ACCOUNT ADDRESSES / DASHBOARD / ORDERS ========
// ===============================================

const AccountAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [editingId, setEditingId] = useState(null); 

  useEffect(() => {
    const loadAddresses = async () => {
        try {
            const data = await profileService.fetchAddresses();
            setAddresses(data);
        } catch (err) {
            console.error("Failed to load addresses:", err);
        } finally {
            setLoading(false);
        }
    };
    loadAddresses();
  }, []);

  const handleNewAddressSave = (newAddress) => {
    setAddresses(prev => [...prev, newAddress]);
    setShowNewForm(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
        await profileService.deleteAddress(id);
        setAddresses(prev => prev.filter(addr => addr.id !== id));
    } catch (err) {
        console.error("Deletion failed:", err);
        alert("Failed to delete address.");
    }
  };

  const handleUpdate = (id, updatedData) => {
    setAddresses(prev => prev.map(addr => 
        addr.id === id ? { ...addr, ...updatedData } : addr
    ));
    setEditingId(null); 
  };


  if (loading) {
    return <div className="account-section">Loading Addresses...</div>;
  }

  return (
    <div className="account-section">
      <h3>Saved Addresses</h3>
      
      {showNewForm && (
        <div style={{marginTop: '30px'}}>
            <NewAddressForm onSave={handleNewAddressSave} />
            <button onClick={() => setShowNewForm(false)} style={{marginTop: '10px', background: 'none', border: 'none', color: '#666', cursor: 'pointer'}}>Cancel</button>
        </div>
      )}

      <button 
        className="secondary-btn auth-btn" 
        onClick={() => { setShowNewForm(true); setEditingId(null); }} 
        style={{marginTop: '25px', width: '250px', background: '#4ecdc4', color: 'white'}}
      >
        + Add New Address
      </button>
      
      <div className="address-list" style={{marginTop: '20px'}}>
        {addresses.length === 0 ? (
          <p>You have no saved addresses.</p>
        ) : (
          addresses.map((addr) => (
            <React.Fragment key={addr.id}>
              {editingId === addr.id ? (
                // Show Edit Form
                <EditAddressForm 
                    address={addr} 
                    onUpdate={handleUpdate} 
                    onCancel={() => setEditingId(null)} 
                />
              ) : (
                // Show Address Card with Buttons
                <div className="address-card">
                  <h4>{addr.fullName || 'Address'} {addr.isDefault && <span style={{fontSize: '0.8em', color: 'green', marginLeft: '10px'}}>(Default)</span>}</h4>
                  <p>{addr.addressLine1}, {addr.addressLine2 && `${addr.addressLine2}, `}
                  {addr.city}, {addr.state} - {addr.pincode}</p>
                  
                  <div style={{ marginTop: '10px', display: 'flex', gap: '15px' }}>
                    <button onClick={() => setEditingId(addr.id)} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 500 }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(addr.id)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))
        )}
      </div>
      
    </div>
  );
};


const AccountDashboard = ({ userData }) => {
    const { user } = useSelector(state => state.auth); 
    return (
      <div className="account-section">
        <h3>Account Overview</h3>
        <p>Welcome back, {userData.firstName || user?.email}!</p>
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
};

const AccountOrders = () => (
    <div className="account-section">
      <h3>Order History</h3>
      <p>Track, return, or view details for all your past orders.</p>
      <div className="order-list">
          <div className="order-item">#1001 - Delivered (2025-11-20)</div>
          <div className="order-item">#1002 - Shipped (Expected: 2025-12-10)</div>
      </div>
    </div>
);


// ===============================================
// ======== MAIN ACCOUNT PAGE COMPONENT ========
// ===============================================

const AccountPage = ({ onNavigate }) => {
  const { user } = useSelector(state => state.auth); 
  const [activeTab, setActiveTab] = useState("dashboard"); 
  const [profileData, setProfileData] = useState({ 
    firstName: user?.displayName?.split(' ')[0] || '',
    lastName: user?.displayName?.split(' ').slice(1).join(' ') || '',
    phone: '',
    email: user?.email || '',
  });
  const [loading, setLoading] = useState(true);
  
  // 1. Fetch backend profile details 
  useEffect(() => {
    const loadProfile = async () => {
        try {
            const backendData = await profileService.fetchProfileDetails();
            setProfileData(prev => ({
                ...prev,
                firstName: backendData.firstName || prev.firstName,
                lastName: backendData.lastName || prev.lastName,
                phone: backendData.phone || '',
            }));
        } catch (err) {
            console.warn("Could not fetch full profile details from backend:", err);
        } finally {
            setLoading(false);
        }
    };
    if (user) {
        loadProfile();
    }
  }, [user]);
  
  
  const renderContent = () => {
    if (loading) {
      return <div className="account-section">Loading Account Data...</div>;
    }
    
    switch (activeTab) {
      case "dashboard":
        return <AccountDashboard userData={profileData} />;
      case "profile":
        return <AccountProfile userData={profileData} />;
      case "orders":
        return <AccountOrders />;
      case "addresses":
        return <AccountAddresses />;
      case "favorites":
        onNavigate('favorites'); 
        return null; 
      default:
        return <AccountDashboard userData={profileData} />;
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
              onClick={() => setActiveTab("favorites")}
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
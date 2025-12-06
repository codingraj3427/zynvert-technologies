import React, { useState, useEffect, useRef } from "react";
// 1. Redux & Service Imports
import { useSelector, useDispatch } from 'react-redux'; 
import { authService } from '../../../services/auth.service'; // <--- Service for logout
import { logoutUser } from '../../../store/authSlice'; // <--- Action to update Redux

import LogoIcon from "../../../assets/icons/LogoIcon";
import CartIcon from "../../../assets/icons/CartIcon";
import CloseIcon from "../../../assets/icons/CloseIcon";
import SearchIcon from "../../../assets/icons/SearchIcon";
import UserIcon from "../../../assets/icons/UserIcon";
import HeartIcon from "../../../assets/icons/HeartIcon";
import HamburgerIcon from "../../../assets/icons/HamburgerIcon";
import Navbar from "../Navbar/Navbar";

const navCategories = [
  { name: "Lithium & LiFePO4 Batteries" },
  { name: "Inverters & Solar" },
  { name: "BMS & Protection Boards" },
  { name: "Battery Packs" },
  { name: "Wires & Connectors" },
  { name: "Chargers & Power Supplies" },
  { name: "Raw Cells & Holders" },
  { name: "Tools & Accessories" },
];

const Header = ({ onNavigate, toUrlFriendly, cartItemCount }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useDispatch(); // <--- Initialize dispatch
  // Get user data from Redux
  const { isAuthenticated, user } = useSelector(state => state.auth);

  // Determine user display name
  const userDisplayName = user?.displayName || user?.email?.split('@')[0] || 'My Account';
  
  const [placeholder, setPlaceholder] = useState("");
  const timeoutRef = useRef(null);
  const placeholderTexts = useRef([
    "Buy inverter...",
    "Try our batteries...",
    "Search for BMS...",
    "Find connectors...",
  ]);
  const textIndex = useRef(0);
  const charIndex = useRef(0);
  const isDeleting = useRef(false);

  // ⭐️ NEW: Logout Handler
  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logoutUser());
      // Navigate to home page after logout
      onNavigate('home');
      setMobileMenuOpen(false); // Close mobile menu if logout happened there
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle logout error (e.g., show notification)
    }
  };


  // FIX: This useEffect now depends on isMobileMenuOpen AND isSearching
  useEffect(() => {
    const stopAnimation = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };

    // If menu is open or user is searching, stop the animation
    if (isMobileMenuOpen || isSearching) {
      stopAnimation();
      setPlaceholder("Search for products...");
      return; // Exit the effect
    }

    // If the menu is closed and user is not searching, restart the animation
    const type = () => {
      const currentText = placeholderTexts.current[textIndex.current];
      const typingSpeed = isDeleting.current ? 80 : 120;
      let displayedText = isDeleting.current
        ? currentText.substring(0, charIndex.current - 1)
        : currentText.substring(0, charIndex.current + 1);

      setPlaceholder(displayedText + "|");

      if (isDeleting.current) {
        charIndex.current--;
      } else {
        charIndex.current++;
      }

      if (!isDeleting.current && charIndex.current > currentText.length) {
        isDeleting.current = true;
        timeoutRef.current = setTimeout(type, 2000);
      } else if (isDeleting.current && charIndex.current === 0) {
        isDeleting.current = false;
        textIndex.current =
          (textIndex.current + 1) % placeholderTexts.current.length;
        timeoutRef.current = setTimeout(type, 500);
      } else {
        timeoutRef.current = setTimeout(type, typingSpeed);
      }
    };

    timeoutRef.current = setTimeout(type, 250);

    return stopAnimation;
  }, [isMobileMenuOpen, isSearching]); // Dependency array updated

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
  }, [isMobileMenuOpen]);

  const MobileNav = () => (
    <div className={`mobile-nav-overlay ${isMobileMenuOpen ? "open" : ""}`}>
      <div className="mobile-nav-content">
        <div className="mobile-nav-header">
          <h3>Menu</h3>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="close-btn"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="mobile-search-bar">
          <input type="text" placeholder="Search products..." />
          <button>
            <SearchIcon />
          </button>
        </div>
        <nav className="mobile-nav-links">
          <a
            href="#home"
            onClick={() => {
              onNavigate("home");
              setMobileMenuOpen(false);
            }}
            className="mobile-nav-link"
          >
            Home
          </a>
          <a
            href="#shop"
            onClick={() => {
              onNavigate("shop");
              setMobileMenuOpen(false);
            }}
            className="mobile-nav-link"
          >
            Shop
          </a>
          <a href="#new" className="mobile-nav-link">
            New Arrivals
          </a>
          <a
            href="#contact"
            onClick={() => {
              onNavigate("contact");
              setMobileMenuOpen(false);
            }}
            className="mobile-nav-link"
          >
            Contact Us
          </a>
          <a href="#sale" className="mobile-nav-link sale">
            SALE 30% OFF!
          </a>
          <hr />
          <h4 className="mobile-nav-title">All Categories</h4>
          {navCategories.map((cat) => (
            <a
              href={`/category/${toUrlFriendly(cat.name)}`}
              key={cat.name}
              className="mobile-nav-link sub-link"
            >
              {cat.name}
            </a>
          ))}
          <hr />
          <h4 className="mobile-nav-title">My Account</h4>
          {isAuthenticated ? (
            <>
              <a
                href="#profile"
                onClick={() => {
                  onNavigate("account"); // Navigating to account page
                  setMobileMenuOpen(false);
                }}
                className="mobile-nav-link user-link"
              >
                <UserIcon /> Hello, {userDisplayName}!
              </a>
              {/* ⭐️ NEW: Mobile Logout Button */}
              <button
                onClick={handleLogout}
                className="mobile-nav-link user-link"
                style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'inherit', textAlign: 'left', padding: '10px 15px' }}
              >
                <i className="fas fa-sign-out-alt"></i> Sign Out
              </button>
            </>
          ) : (
            <a
              href="#auth"
              onClick={() => {
                onNavigate("auth");
                setMobileMenuOpen(false);
              }}
              className="mobile-nav-link user-link"
            >
              <UserIcon /> Sign In
            </a>
          )}
          <a href="#favorites" className="mobile-nav-link user-link">
            <HeartIcon /> Favorites
          </a>
          <a
            href="#cart"
            onClick={() => {
              onNavigate("cart");
              setMobileMenuOpen(false);
            }}
            className="mobile-nav-link user-link"
          >
            <CartIcon itemCount={cartItemCount} />
            <span>My Cart</span>
          </a>
        </nav>
      </div>
    </div>
  );

  return (
    <header className="header">
      <MobileNav />
      <div className="header-content-wrapper">
        <div className="header-top">
          <div className="logo-container">
            <a
              href="#home"
              onClick={() => onNavigate("home")}
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <LogoIcon />
              <h1>Zynvert</h1>
            </a>
          </div>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for Batteries, Inverters, BMS..."
            />
            <button>
              <SearchIcon />
            </button>
          </div>
          <div className="mobile-header-actions">
            <a
              href="#cart"
              onClick={() => onNavigate("cart")}
              className="action-item-mobile"
            >
              <CartIcon itemCount={cartItemCount} />
            </a>
            <button
              className="hamburger-menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              <HamburgerIcon />
            </button>
          </div>
          <div className="user-actions">
            {isAuthenticated ? (
              // ⭐️ NEW: User Name and Logout Button container
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <a
                  href="#profile"
                  onClick={() => onNavigate('account')} // Navigating to account page
                  className="action-item"
                >
                  <UserIcon />
                  <span>Hello, {userDisplayName}</span>
                </a>
                <button 
                  onClick={handleLogout} 
                  className="action-item" 
                  style={{ 
                    // Add minimal styling to make it look like a button
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    color: 'var(--text-color)', 
                    padding: 0, 
                    display: 'flex', 
                    alignItems: 'center' 
                  }}
                >
                  <i className="fas fa-sign-out-alt"></i> {/* Assuming you have Font Awesome or similar for icons */}
                  <span style={{ marginLeft: '5px' }}>Logout</span>
                </button>
              </div>
            ) : (
              <a
                href="#auth"
                onClick={() => onNavigate("auth")}
                className="action-item"
              >
                <UserIcon />
                <span>Sign In</span>
              </a>
            )}
            <a href="#favorites" className="action-item">
              <HeartIcon />
              <span>Favorites</span>
            </a>
            <a
              href="#cart"
              onClick={() => onNavigate("cart")}
              className="action-item"
            >
              <CartIcon itemCount={cartItemCount} />
              <span>My Cart</span>
            </a>
          </div>
        </div>
        <div className="mobile-search-container">
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearching(true)}
            onBlur={() => {
              if (searchQuery === "") {
                setIsSearching(false);
              }
            }}
          />
          <button>
            <SearchIcon />
          </button>
        </div>
      </div>
      <Navbar onNavigate={onNavigate} toUrlFriendly={toUrlFriendly} />
    </header>
  );
};

export default Header;
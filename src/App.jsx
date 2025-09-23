import React, { useState, useEffect, useRef } from "react";
import "./App.css";

// ======== ICONS ========
const LogoIcon = () => (
  // The main logo's primary color is now the greenish accent color.
  <svg height="40" viewBox="0 0 100 100">
    <path fill="var(--accent-color)" d="M50 0 L100 25 L100 75 L50 100 L0 75 L0 25 Z" />
    <path
      fill="#FFFFFF"
      d="M50 15 L85 32.5 L85 67.5 L50 85 L15 67.5 L15 32.5 Z"
    />
    <path
      fill="#3A3A3A"
      d="M50 25 L75 37.5 L75 62.5 L50 75 L25 62.5 L25 37.5 Z"
    />
  </svg>
);

// A monochrome version for the dark footer.
const FooterLogoIcon = () => (
    <svg height="40" viewBox="0 0 100 100">
        <path fill="var(--white-color)" d="M50 0 L100 25 L100 75 L50 100 L0 75 L0 25 Z" />
        <path fill="#1a1a1a" d="M50 15 L85 32.5 L85 67.5 L50 85 L15 67.5 L15 32.5 Z" />
        <path fill="#3A3A3A" d="M50 25 L75 37.5 L75 62.5 L50 75 L25 62.5 L25 37.5 Z" />
    </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
    <circle cx="11" cy="11" r="8"></circle> <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path> <circle cx="12" cy="7" r="4"></circle>
  </svg>
);
const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
    <circle cx="9" cy="21" r="1"></circle> <circle cx="20" cy="21" r="1"></circle> <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);
const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);
const GridIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
    <rect x="3" y="3" width="7" height="7"></rect> <rect x="14" y="3" width="7" height="7"></rect> <rect x="14" y="14" width="7" height="7"></rect> <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);
const HamburgerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
    <line x1="3" y1="12" x2="21" y2="12"></line> <line x1="3" y1="6" x2="21" y2="6"></line> <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" >
    <line x1="18" y1="6" x2="6" y2="18"></line> <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// Social Icons for Footer
const FacebookIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" > <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path> </svg>);
const XIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"> <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path> </svg>);
const InstagramIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" > <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect> <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path> <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line> </svg>);
const YouTubeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" > <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 11.75a29 29 0 0 0-.46-5.33z"></path> <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon> </svg>);
const TelegramIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" > <path d="M22 2l-7 20-4-9-9-4 20-7z"></path> </svg>);


// ======== HELPER FUNCTION ========
const toUrlFriendly = (text) => text.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-").replace(/[^\w-]+/g, "");

// ======== MOCK DATA ========
const navCategories = [ { name: "Lithium & LiFePO4 Batteries" }, { name: "Inverters & Solar" }, { name: "BMS & Protection Boards" }, { name: "Battery Packs" }, { name: "Wires & Connectors" }, { name: "Chargers & Power Supplies" }, { name: "Raw Cells & Holders" }, { name: "Tools & Accessories" }, ];
const popularCategories = [ { name: "Lithium-Ion Batteries", image: "https://placehold.co/300x300/FF6B6B/ffffff?text=Li-Ion", }, { name: "LiFePO4 Batteries", image: "https://placehold.co/300x300/4ECDC4/ffffff?text=LiFePO4", }, { name: "Integrated Inverters", image: "https://placehold.co/300x300/3A3A3A/ffffff?text=Inverter", }, { name: "Solar Inverters", image: "https://placehold.co/300x300/FF6B6B/ffffff?text=Solar", }, { name: "BMS", image: "https://placehold.co/300x300/4ECDC4/ffffff?text=BMS" }, { name: "Connectors & Wires", image: "https://placehold.co/300x300/3A3A3A/ffffff?text=Wires", }, ];
const featuredProducts = [ { name: "Zynvert 12V 100Ah LiFePO4 Battery", price: "₹15,999", image: "https://placehold.co/400x400/eeeeee/333333?text=Zynvert+100Ah", }, { name: "Solar Integrated Inverter 3kW", price: "₹45,500", image: "https://placehold.co/400x400/eeeeee/333333?text=Solar+Inverter", }, { name: "4S 100A BMS with Active Balancer", price: "₹2,499", image: "https://placehold.co/400x400/eeeeee/333333?text=4S+BMS", }, { name: "High-Current DC Wires (10 Mtr)", price: "₹899", image: "https://placehold.co/400x400/eeeeee/333333?text=DC+Wires", }, ];
const recentlyLaunchedProducts = [ { name: "2S 4A BMS for LiFePO4 (LFP)", price: "₹99.00", oldPrice: "₹25.00", image: "https://placehold.co/200x200/eeeeee/333?text=2S+BMS", }, { name: "Heat Shrink Tube 290mm", price: "₹349.00", oldPrice: "₹119.00", image: "https://placehold.co/200x200/eeeeee/333?text=Tube", }, { name: "Daly 4S 60A LiFePO4 BMS", price: "₹2,999.00", oldPrice: "₹1,199.00", image: "https://placehold.co/200x200/eeeeee/333?text=Daly+4S", }, { name: "Jiabaida (JBD) 60A BMS", price: "₹2,999.00", oldPrice: "₹1,199.00", image: "https://placehold.co/200x200/eeeeee/333?text=JBD+BMS", }, ];
const showcaseCategories = [ "Amplifier Cabinets", "Amplifier Power", "Audio Boards", "AVR Boards", "Capacitors", "Connectors", "E-BIKE", "Home Audio", "Integrated Circuit", "Inverter Cabinets", "Inverter Kit", "Lithium Battery", ];
const footerCategories = [ "Audio Boards", "Transformers", "AC TO DC Power Supply", "SMPS Boards", "Speakers", "AVR Boards", "Connector", ];
const footerPolicies = [ "Privacy Policy", "Refund & Cancellations", "Terms & Conditions", "About Us", ];

// ======== COMPONENT DEFINITIONS ========

/**
 * New: Page Loader Component with "Z" animation
 */
const PageLoader = () => {
    return (
        <div className="page-loader">
            <svg className="z-loader" viewBox="0 0 100 100">
                <path className="z-loader-path" d="M 20 20 L 80 20 L 20 80 L 80 80" />
            </svg>
        </div>
    );
};


/**
 * Section 1: Header and Navbar
 */
const Header = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
  }, [isMobileMenuOpen]);

  const MobileNav = () => (
    <div className={`mobile-nav-overlay ${isMobileMenuOpen ? "open" : ""}`}>
      <div className="mobile-nav-content">
        <div className="mobile-nav-header">
          <h3>Menu</h3>
          <button onClick={() => setMobileMenuOpen(false)} className="close-btn" >
            <CloseIcon />
          </button>
        </div>
        <div className="mobile-search-bar">
          <input type="text" placeholder="Search products..." />
          <button> <SearchIcon /> </button>
        </div>
        <nav className="mobile-nav-links">
          <a href="/" className="mobile-nav-link"> Home </a>
          <a href="/shop" className="mobile-nav-link"> Shop </a>
          <a href="/new-arrivals" className="mobile-nav-link"> New Arrivals </a>
          <a href="/contact" className="mobile-nav-link"> Contact Us </a>
          <a href="/sale" className="mobile-nav-link sale"> SALE 30% OFF! </a>
          <hr />
          <h4 className="mobile-nav-title">All Categories</h4>
          {navCategories.map((cat) => (
            <a href={`/category/${toUrlFriendly(cat.name)}`} key={cat.name} className="mobile-nav-link sub-link" >
              {cat.name}
            </a>
          ))}
          <hr />
          <h4 className="mobile-nav-title">My Account</h4>
          <a href="/login" className="mobile-nav-link user-link"> <UserIcon /> Sign In </a>
          <a href="/favorites" className="mobile-nav-link user-link"> <HeartIcon /> Favorites </a>
          <a href="/cart" className="mobile-nav-link user-link"> <CartIcon /> My Cart </a>
        </nav>
      </div>
    </div>
  );

  return (
    <header className="header">
      <MobileNav />
      <div className="header-top">
        <div className="logo-container">
          <LogoIcon />
          <h1>Zynvert Technologies</h1>
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Search for Batteries, Inverters, BMS..." />
          <button> <SearchIcon /> </button>
        </div>
        <button className="hamburger-menu" onClick={() => setMobileMenuOpen(true)} >
          <HamburgerIcon />
        </button>
        <div className="user-actions">
          <a href="/login" className="action-item"> <UserIcon /> <span>Sign In</span> </a>
          <a href="/favorites" className="action-item"> <HeartIcon /> <span>Favorites</span> </a>
          <a href="/cart" className="action-item"> <CartIcon /> <span>My Cart</span> </a>
        </div>
      </div>
      <nav className="navbar">
        <div className="navbar-left" ref={dropdownRef}>
          <button className="categories-button" onClick={() => setDropdownOpen(!isDropdownOpen)} >
            <GridIcon />
            All Categories
            <span className={`arrow ${isDropdownOpen ? "up" : "down"}`}></span>
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              {navCategories.map((category) => (
                <a href={`/category/${toUrlFriendly(category.name)}`} className="dropdown-item" key={category.name} >
                  <span>{category.name}</span>
                  <span className="chevron">›</span>
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="nav-links">
          <a href="/" className="nav-link active"> Home </a>
          <a href="/shop" className="nav-link"> Shop </a>
          <a href="/new-arrivals" className="nav-link"> New Arrivals </a>
          <a href="/contact" className="nav-link"> Contact </a>
        </div>
        <div className="nav-promo">
          <a href="/sale">SALE 30% OFF!</a>
        </div>
      </nav>
    </header>
  );
};

/**
 * Section 2: Hero Section with large category cards
 */
const HeroSection = () => {
  return (
    <section className="hero-section section-reveal">
      <div className="hero-card large">
        <h2>Integrated Solar Inverters</h2>
        <p>Our flagship product for reliable, off-grid power.</p>
        <button>Shop Now</button>
      </div>
      <div className="hero-card-grid">
        <div className="hero-card small">
          <h3>Lithium-Ion Packs</h3>
          <p>High-density power</p>
          <a href="/shop/li-ion">Explore →</a>
        </div>
        <div className="hero-card small">
          <h3>LiFePO4 Batteries</h3>
          <p>Safe and long-lasting</p>
          <a href="/shop/lifepo4">Explore →</a>
        </div>
        <div className="hero-card small">
          <h3>BMS Systems</h3>
          <p>Protect your investment</p>
          <a href="/shop/bms">Explore →</a>
        </div>
        <div className="hero-card small">
          <h3>Accessories</h3>
          <p>Wires, Connectors & More</p>
          <a href="/shop/accessories">Explore →</a>
        </div>
      </div>
    </section>
  );
};

/**
 * Section 3: Popular Categories
 */
const PopularCategories = () => {
  return (
    <section className="page-section section-reveal">
      <h2 className="section-title">Popular Categories</h2>
      <div className="category-grid">
        {popularCategories.map((category) => (
          <div key={category.name} className="category-card">
            <img src={category.image} alt={category.name} />
            <h3>{category.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

/**
 * Section 4: Featured Products
 */
const FeaturedProducts = () => {
  return (
    <section className="page-section bg-light section-reveal">
      <h2 className="section-title">Our Featured Products</h2>
      <div className="product-grid">
        {featuredProducts.map((product) => (
          <div key={product.name} className="product-card">
            <div className="product-image-container">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">{product.price}</p>
              <button className="add-to-cart-btn">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

/**
 * Section 5: Showcase of recently launched products
 */
const ShowcaseSection = () => {
  return (
    <section className="page-section section-reveal">
      <h2 className="section-title">Recently Launched</h2>
      <div className="showcase-section">
        <div className="showcase-left">
          <div className="showcase-banner">
            <h2>Online Electronics Store</h2>
            <p>Just a Click to Get Your Electronics</p>
            <button>Shop Now</button>
          </div>
          <ul className="showcase-category-list">
            {showcaseCategories.map((cat) => (
              <li key={cat}>
                <a href={`/category/${toUrlFriendly(cat)}`}>{cat}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="showcase-right">
          <div className="showcase-product-grid">
            {recentlyLaunchedProducts.map((product) => (
              <div key={product.name} className="showcase-product-card">
                <img src={product.image} alt={product.name} />
                <div className="showcase-product-info">
                  <p className="showcase-product-name">{product.name}</p>
                  <div className="showcase-product-pricing">
                    <span className="current-price">{product.oldPrice}</span>
                    <span className="old-price">{product.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * Section 6: Contact Form
 */
const ContactSection = () => {
  return (
    <section className="page-section bg-light section-reveal">
      <h2 className="section-title">Get In Touch</h2>
      <p className="section-subtitle"> Have questions? We'd love to hear from you. </p>
      <form className="contact-form">
        <div className="form-row">
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
        </div>
        <textarea placeholder="Your Message" rows="6" required></textarea>
        <button type="submit" className="submit-btn"> Send Message </button>
      </form>
    </section>
  );
};

/**
 * Section 7: Footer
 */
const Footer = () => {
  return (
    <footer className="footer section-reveal">
      <div className="footer-content">
        <div className="footer-column about">
          <div className="logo-container">
            <FooterLogoIcon />
          </div>
          <p>Call us 10 AM - 6 PM</p>
          <p className="phone-number">+91 9123708861</p>
          <div className="social-icons">
            <a href="https://facebook.com" aria-label="Facebook"> <FacebookIcon /> </a>
            <a href="https://x.com" aria-label="X"> <XIcon /> </a>
            <a href="https://instagram.com" aria-label="Instagram"> <InstagramIcon /> </a>
            <a href="https://youtube.com" aria-label="YouTube"> <YouTubeIcon /> </a>
            <a href="https://telegram.org" aria-label="Telegram"> <TelegramIcon /> </a>
          </div>
        </div>
        <div className="footer-column links">
          <h4>Categories</h4>
          <ul>
            {footerCategories.map((cat) => (
              <li key={cat}>
                <a href={`/category/${toUrlFriendly(cat)}`}>{cat}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-column links">
          <h4>Our Policies</h4>
          <ul>
            {footerPolicies.map((policy) => (
              <li key={policy}>
                <a href={`/policy/${toUrlFriendly(policy)}`}>{policy}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-column contact">
          <h4>Contact Us</h4>
          <p> Debolina apartment Flat no-101 Ground floor, Kolkata - 700059, West Bengal, India </p>
          <a href="mailto:support@zynvert.com">support@zynvert.com</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>Copyright © {new Date().getFullYear()} Zynvert Technologies.</p>
        <div className="payment-info">
          <span>We Use Safe Payment For</span>
          <img src="https://placehold.co/150x25/ffffff/333?text=Payment+Methods" alt="Payment Methods" />
        </div>
      </div>
    </footer>
  );
};

// ======== MAIN APP COMPONENT ========
function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a network request or asset loading
    const timer = setTimeout(() => setIsLoading(false), 2500); // Adjust time as needed
    return () => clearTimeout(timer);
  }, []);

  // Section reveal animation logic
  useEffect(() => {
    if (isLoading) return; // Don't run if the page is still loading

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll(".section-reveal");
    sections.forEach((section) => observer.observe(section));

    return () => sections.forEach((section) => observer.unobserve(section));
  }, [isLoading]); // Rerun effect when loading is finished

  return (
    <div className="App">
      {isLoading && <PageLoader />}
      <div className={`app-content ${!isLoading ? "visible" : ""}`}>
        <Header />
        <main>
          <HeroSection />
          <PopularCategories />
          <FeaturedProducts />
          <ShowcaseSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;


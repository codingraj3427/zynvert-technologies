import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// ======== ICONS ========
// Using SVGs directly is efficient. You can replace these with an icon library later.
const LogoIcon = () => (
  <svg height="40" viewBox="0 0 100 100">
    {/* The main color is now the greenish accent color */}
    <path fill="var(--accent-color)" d="M50 0 L100 25 L100 75 L50 100 L0 75 L0 25 Z" />
    <path fill="#FFFFFF" d="M50 15 L85 32.5 L85 67.5 L50 85 L15 67.5 L15 32.5 Z" />
    <path fill="#3A3A3A" d="M50 25 L75 37.5 L75 62.5 L50 75 L25 62.5 L25 37.5 Z" />
  </svg>
);

const FooterLogoIcon = () => (
    <svg height="40" viewBox="0 0 100 100">
        <path fill="var(--white-color)" d="M50 0 L100 25 L100 75 L50 100 L0 75 L0 25 Z" />
        <path fill="#1a1a1a" d="M50 15 L85 32.5 L85 67.5 L50 85 L15 67.5 L15 32.5 Z" />
        <path fill="#3A3A3A" d="M50 25 L75 37.5 L75 62.5 L50 75 L25 62.5 L25 37.5 Z" />
    </svg>
);


const SearchIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>);
const UserIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>);
const CartIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>);
const HeartIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>);
const GridIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>);
const HamburgerIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>);
const CloseIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);

// ======== MOCK DATA ========
const navCategories = [
    { name: 'Lithium & LiFePO4 Batteries', link: '/categories/batteries' },
    { name: 'Inverters & Solar', link: '/categories/inverters' },
    { name: 'BMS & Protection Boards', link: '/categories/bms' },
    { name: 'Battery Packs', link: '/categories/packs' },
    { name: 'Wires & Connectors', link: '/categories/wires' },
    { name: 'Chargers & Power Supplies', link: '/categories/chargers' },
    { name: 'Raw Cells & Holders', link: '/categories/cells' },
    { name: 'Tools & Accessories', link: '/categories/tools' }
];

const popularCategories = [
    { name: 'Lithium-Ion Batteries', image: 'https://placehold.co/300x300/4ECDC4/ffffff?text=Li-Ion' },
    { name: 'LiFePO4 Batteries', image: 'https://placehold.co/300x300/FF6B6B/ffffff?text=LiFePO4' },
    { name: 'Integrated Inverters', image: 'https://placehold.co/300x300/3A3A3A/ffffff?text=Inverter' },
    { name: 'Solar Inverters', image: 'https://placehold.co/300x300/4ECDC4/ffffff?text=Solar' },
    { name: 'BMS', image: 'https://placehold.co/300x300/FF6B6B/ffffff?text=BMS' },
    { name: 'Connectors & Wires', image: 'https://placehold.co/300x300/3A3A3A/ffffff?text=Wires' },
];

const featuredProducts = [
    { name: 'Zynvert 12V 100Ah LiFePO4 Battery', price: '₹15,999', image: 'https://placehold.co/400x400/eeeeee/333333?text=Zynvert+100Ah' },
    { name: 'Solar Integrated Inverter 3kW', price: '₹45,500', image: 'https://placehold.co/400x400/eeeeee/333333?text=Solar+Inverter' },
    { name: '4S 100A BMS with Active Balancer', price: '₹2,499', image: 'https://placehold.co/400x400/eeeeee/333333?text=4S+BMS' },
    { name: 'High-Current DC Wires (10 Mtr)', price: '₹899', image: 'https://placehold.co/400x400/eeeeee/333333?text=DC+Wires' },
];

const recentlyLaunchedProducts = [
    { name: '2S 4A BMS for LiFePO4 (LFP)', price: '₹99.00', oldPrice: '₹25.00', image: 'https://placehold.co/200x200/eeeeee/333?text=2S+BMS' },
    { name: 'Heat Shrink Tube 290mm', price: '₹349.00', oldPrice: '₹119.00', image: 'https://placehold.co/200x200/eeeeee/333?text=Tube' },
    { name: 'Daly 4S 60A LiFePO4 BMS', price: '₹2,999.00', oldPrice: '₹1,199.00', image: 'https://placehold.co/200x200/eeeeee/333?text=Daly+4S' },
    { name: 'Jiabaida (JBD) 60A BMS', price: '₹2,999.00', oldPrice: '₹1,199.00', image: 'https://placehold.co/200x200/eeeeee/333?text=JBD+BMS' }
];

const showcaseCategories = [
    'Amplifier Cabinets', 'Amplifier Power', 'Audio Boards', 'AVR Boards',
    'Capacitors', 'Connectors', 'E-BIKE', 'Home Audio', 'Integrated Circuit',
    'Inverter Cabinets', 'Inverter Kit', 'Lithium Battery'
];


// ======== COMPONENT DEFINITIONS ========

/**
 * Section 1: Header and Navbar
 */
const Header = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isMobileNavOpen, setMobileNavOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);


    return (
        <header className="header">
            {/* --- Desktop Header --- */}
            <div className="header-top">
                <div className="logo-container">
                    <LogoIcon />
                    <h1>Zynvert Technologies</h1>
                </div>
                <div className="search-bar">
                    <input type="text" placeholder="Search for Batteries, Inverters, BMS..." />
                    <button><SearchIcon /></button>
                </div>
                <div className="user-actions">
                    <a href="/login" className="action-item">
                        <UserIcon />
                        <span>Sign In</span>
                    </a>
                    <a href="/favorites" className="action-item">
                        <HeartIcon />
                        <span>Favorites</span>
                    </a>
                    <a href="/cart" className="action-item">
                        <CartIcon />
                        <span>My Cart</span>
                    </a>
                </div>
                 <button className="hamburger-menu" onClick={() => setMobileNavOpen(true)}>
                    <HamburgerIcon />
                </button>
            </div>

            <nav className="navbar">
                <div className="navbar-left" ref={dropdownRef}>
                    <button className="categories-button" onClick={() => setDropdownOpen(!isDropdownOpen)}>
                        <GridIcon />
                        All Categories
                        <span className={`arrow ${isDropdownOpen ? 'up' : 'down'}`}></span>
                    </button>
                    {isDropdownOpen && (
                        <div className="dropdown-menu">
                            {navCategories.map((category) => (
                                <a href={category.link} className="dropdown-item" key={category.name}>
                                    <span>{category.name}</span>
                                    <span className="chevron">›</span>
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                <div className="nav-links">
                    <a href="/" className="nav-link active">Home</a>
                    <a href="/shop" className="nav-link">Shop</a>
                    <a href="/new-arrivals" className="nav-link">New Arrivals</a>
                    <a href="/contact" className="nav-link">Contact</a>
                </div>
                <div className="nav-promo">
                    <a href="/sale">SALE 30% OFF!</a>
                </div>
            </nav>

            {/* --- Mobile Navigation --- */}
            <div className={`mobile-nav-overlay ${isMobileNavOpen ? 'open' : ''}`} onClick={() => setMobileNavOpen(false)}>
                <div className="mobile-nav-content" onClick={(e) => e.stopPropagation()}>
                    <div className="mobile-nav-header">
                        <h3>Menu</h3>
                        <button className="close-btn" onClick={() => setMobileNavOpen(false)}><CloseIcon /></button>
                    </div>
                    
                    <div className="mobile-search-bar">
                         <input type="text" placeholder="Search products..." />
                    </div>

                    <div className="mobile-nav-links">
                        <a href="/" className="mobile-nav-link">Home</a>
                        <a href="/shop" className="mobile-nav-link">Shop</a>
                        <a href="/new-arrivals" className="mobile-nav-link">New Arrivals</a>
                        <a href="/contact" className="mobile-nav-link">Contact</a>
                         <a href="/sale" className="mobile-nav-link sale">SALE 30% OFF!</a>
                        <hr />
                        <p className="mobile-nav-title">All Categories</p>
                        {navCategories.map(cat => (
                             <a href={cat.link} key={cat.name} className="mobile-nav-link sub-link">{cat.name}</a>
                        ))}
                        <hr />
                        <a href="/login" className="mobile-nav-link user-link"><UserIcon /> Sign In</a>
                        <a href="/cart" className="mobile-nav-link user-link"><CartIcon /> My Cart</a>
                        <a href="/favorites" className="mobile-nav-link user-link"><HeartIcon /> Favorites</a>
                    </div>
                </div>
            </div>

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
                {popularCategories.map(category => (
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
                {featuredProducts.map(product => (
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
                        {showcaseCategories.map(cat => <li key={cat}><a href={`/category/${cat.toLowerCase().replace(' ', '-')}`}>{cat}</a></li>)}
                    </ul>
                </div>
                <div className="showcase-right">
                    <div className="showcase-product-grid">
                         {recentlyLaunchedProducts.map(product => (
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
    )
}

/**
 * Section 6: Contact Form
 */
const ContactSection = () => {
    return (
        <section className="page-section bg-light section-reveal">
            <h2 className="section-title">Get In Touch</h2>
            <p className="section-subtitle">Have questions? We'd love to hear from you.</p>
            <form className="contact-form">
                <div className="form-row">
                    <input type="text" placeholder="Your Name" required />
                    <input type="email" placeholder="Your Email" required />
                </div>
                <textarea placeholder="Your Message" rows="6" required></textarea>
                <button type="submit" className="submit-btn">Send Message</button>
            </form>
        </section>
    );
};

/**
 * Section 7: Footer
 */
const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-column about">
                    <div className="logo-container">
                        <FooterLogoIcon />
                    </div>
                    <p>Call us 10 AM - 6 PM</p>
                    <p className="phone-number">+91 9123708861</p>
                    <div className="social-icons">
                       <a href="/facebook">F</a>
                       <a href="/twitter">X</a>
                       <a href="/instagram">I</a>
                       <a href="/youtube">Y</a>
                       <a href="/telegram">T</a>
                    </div>
                </div>

                <div className="footer-column links">
                    <h4>Categories</h4>
                    <ul>
                        <li><a href="/categories/audio">Audio Boards</a></li>
                        <li><a href="/categories/transformers">Transformers</a></li>
                        <li><a href="/categories/power-supply">AC TO DC Power Supply</a></li>
                        <li><a href="/categories/smps">SMPS Boards</a></li>
                        <li><a href="/categories/speakers">Speakers</a></li>
                        <li><a href="/categories/avr">AVR Boards</a></li>
                        <li><a href="/categories/connectors">Connector</a></li>
                    </ul>
                </div>

                <div className="footer-column links">
                    <h4>Our Policies</h4>
                    <ul>
                        <li><a href="/policy/privacy">Privacy Policy</a></li>
                        <li><a href="/policy/refund">Refund & Cancellations</a></li>
                        <li><a href="/policy/terms">Terms & Conditions</a></li>
                        <li><a href="/about">About Us</a></li>
                    </ul>
                </div>

                 <div className="footer-column contact">
                    <h4>Contact Us</h4>
                    <p>Debolina Apartment flat no-101 ground floor, kol-700059</p>
                    <p><a href="mailto:support@zynvert.online">support@zynvert.online</a></p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>Copyright &copy; {new Date().getFullYear()} Powered By Zynvert</p>
                <div className='payment-info'>
                    <span>We Using Safe Payment For</span>
                    {/* Placeholder for payment icons */}
                    <span>UPI/VISA/MASTERCARD</span>
                </div>
            </div>
        </footer>
    );
};


// ======== MAIN APP COMPONENT ========
function App() {

  // Logic for section reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1 // Trigger when 10% of the element is visible
    });

    const elementsToAnimate = document.querySelectorAll('.section-reveal');
    elementsToAnimate.forEach(el => observer.observe(el));

    // Cleanup observer on component unmount
    return () => elementsToAnimate.forEach(el => observer.unobserve(el));
  }, []);


  return (
    <div className="App">
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
  );
}

export default App;


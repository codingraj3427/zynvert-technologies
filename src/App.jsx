import React, { useState, useEffect } from "react";
// 1. Redux Imports
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, logoutUser, setLoading as setAuthLoading } from './store/authSlice';
// 2. Firebase Import (Assumption: You have a firebase config file)
import { auth } from './config/firebase'; 
import { onAuthStateChanged } from 'firebase/auth';

import "./App.css";
import Header from "./components/layout/Header/Header";
import Footer from "./components/layout/Footer/Footer";
import AuthPage from "./pages/Auth/AuthPage";
import CartPage from "./pages/Cart/CartPage";
import ContactPage from "./pages/Contact/ContactPage"; 
import ShopPage from "./pages/Shop/ShopPage"; 
import ProductDetailPage from "./pages/Product/ProductDetailPage"; 
import HeroSection from "./pages/Home/HeroSection";
import PopularCategories from "./pages/Home/PopularCategories";
import FeaturedProducts from "./pages/Home/FeaturedProducts";
import ProductSlider from "./pages/Home/ProductSlider"; 
import ShowcaseSection from "./pages/Home/ShowcaseSection";
import ContactSection from "./pages/Home/ContactSection";
import PageLoader from "./components/common/LoadingSpinner/LoadingSpinner";
import AccountPage from "./pages/Account/AccountPage";


// ======== MOCK DATA (omitted for brevity) ========
const popularCategories = [
  /* ... */
];


const recentlyLaunchedProducts = [
  /* ... */
  {
    id: "bms-2s", 
    name: "2S 4A BMS for LiFePO4 (LFP)",
    price: "₹99.00",
    oldPrice: "₹25.00",
    image: "https://placehold.co/200x200/eeeeee/333?text=2S+BMS",
  },
  {
    id: "shrink-tube", 
    name: "Heat Shrink Tube 290mm",
    price: "₹349.00",
    oldPrice: "₹119.00",
    image: "https://placehold.co/200x200/eeeeee/333?text=Tube",
  },
  {
    id: "daly-bms", 
    name: "Daly 4S 60A LiFePO4 BMS",
    price: "₹2,999.00",
    oldPrice: "₹1,199.00",
    image: "https://placehold.co/200x200/eeeeee/333?text=Daly+4S",
  },
  {
    id: "jbd-60a", 
    name: "Jiabaida (JBD) 60A BMS",
    price: "₹2,999.00",
    oldPrice: "₹1,199.00",
    image: "https://placehold.co/200x200/eeeeee/333?text=JBD+BMS",
  },
];
const showcaseCategories = [
  /* ... */
];
const footerCategories = [
  /* ... */
];
const footerPolicies = [
  /* ... */
];

const INITIAL_CART_MOCK = [
  {
    id: "battery",
    name: "Zynvert 12V 100Ah LiFePO4 Battery",
    price: 15999,
    quantity: 1,
    image: "https://placehold.co/150x150/eeeeee/333333?text=Zynvert+100Ah",
  },
  {
    id: "inverter",
    name: "Solar Integrated Inverter 3kW",
    price: 45500,
    quantity: 1,
    image: "https://placehold.co/150x150/eeeeee/333333?text=Solar+Inverter",
  },
];

// ======== HELPER FUNCTION (omitted for brevity) ========
const toUrlFriendly = (text) =>
  text
    .toLowerCase()
    .replace(/ & /g, "-")
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

const getNumericPrice = (product) => {
  return (
    product.numericPrice ||
    parseFloat(product.price?.replace(/[^\d.]/g, "")) ||
    0
  );
};

// ======== PAGE COMPONENTS (omitted for brevity) ========
const HomePage = ({ onNavigate, onAddToCart }) => (
  <>
    <HeroSection />
    <PopularCategories popularCategories={popularCategories} />
    <ProductSlider
      title="⚡ Hot Deals & Trending Items"
      onNavigate={onNavigate}
      onAddToCart={onAddToCart}
    />
    <FeaturedProducts onNavigate={onNavigate} onAddToCart={onAddToCart} />
    <ShowcaseSection
      recentlyLaunchedProducts={recentlyLaunchedProducts}
      showcaseCategories={showcaseCategories}
      toUrlFriendly={toUrlFriendly}
      onNavigate={onNavigate} 
      onAddToCart={onAddToCart} 
    />
    <ContactSection />
  </>
);

// ======== MAIN APP COMPONENT FIX ========
function App() {
  const [appIsLoading, setAppIsLoading] = useState(true); 
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const dispatch = useDispatch();
  const { isAuthenticated, loading: authLoading } = useSelector(state => state.auth);

  const [cartItems, setCartItems] = useState(INITIAL_CART_MOCK);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // ... (Cart and Navigation handlers omitted for brevity) ...
  const handleAddToCart = (productToAdd) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === productToAdd.id
      );
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const numericPrice = getNumericPrice(productToAdd);
        return [
          ...prevItems,
          {
            id: productToAdd.id,
            name: productToAdd.name,
            price: numericPrice,
            quantity: 1,
            image: productToAdd.image, 
          },
        ];
      }
    });
  };

  const handleQuantityChange = (id, amount) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleNavigate = (page, productId = null) => {
    setSelectedProduct(productId);
    setCurrentPage(page);
  };
  
  // State to simulate data loading time
  const [dataLoaded, setDataLoaded] = useState(false);
  useEffect(() => {
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 500)); 
      setDataLoaded(true);
    };
    loadData();
  }, []);


  // Auth Listener (omitted for brevity)
  useEffect(() => {
    dispatch(setAuthLoading(true)); 
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch(loginSuccess(user));
        if (currentPage === 'auth') {
          handleNavigate('home'); 
        }
      } else {
        dispatch(logoutUser());
      }
      dispatch(setAuthLoading(false));
    });

    return () => unsubscribe();
  }, [dispatch, currentPage]);

  // App Loading Screen Controller (omitted for brevity)
  useEffect(() => {
    if (!authLoading && dataLoaded) {
      const timer = setTimeout(() => setAppIsLoading(false), 200);
      return () => clearTimeout(timer);
    }
  }, [authLoading, dataLoaded]); 

  // Intersection Observer Logic (omitted for brevity)
  useEffect(() => {
    if (appIsLoading) return;
    
    const runObserver = setTimeout(() => {
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
        
        return () => observer.disconnect();
    }, 50); 

    return () => clearTimeout(runObserver);
    
  }, [appIsLoading, currentPage]); 
  


  const renderPage = () => {
    if (selectedProduct) {
      return (
        <ProductDetailPage
          productId={selectedProduct}
          onNavigate={handleNavigate}
          onAddToCart={handleAddToCart}
        />
      );
    }
    
    if (isAuthenticated && currentPage === 'auth') {
        return <HomePage onNavigate={handleNavigate} onAddToCart={handleAddToCart} />;
    }

    switch (currentPage) {
      case "auth":
        return <AuthPage />; 
      case "account":
        return isAuthenticated ? <AccountPage onNavigate={handleNavigate} /> : <AuthPage />;
      case "cart":
        return (
          <CartPage
            onNavigate={handleNavigate}
            cartItems={cartItems}
            handleQuantityChange={handleQuantityChange} 
            removeItem={removeItem} 
          />
        );
      case "contact":
        return <ContactPage />;
      case "shop":
        return (
          <ShopPage onNavigate={handleNavigate} onAddToCart={handleAddToCart} />
        );
      case "home":
      case "orders": 
      case "favorites": 
      default:
        return (
          <HomePage onNavigate={handleNavigate} onAddToCart={handleAddToCart} />
        );
    }
  };

  if (appIsLoading || authLoading || !dataLoaded) {
    return <PageLoader />;
  }


  return (
    <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}> 
      <div className={`app-content ${!appIsLoading ? "visible" : ""}`} 
           style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        
        <Header
            onNavigate={handleNavigate}
            toUrlFriendly={toUrlFriendly}
            cartItemCount={cartItemCount}
        />
        
        <main key={currentPage} style={{ 
            flexGrow: -1, 
            // ⭐️ FIX: Removed alignItems: 'center' to allow full width
            display: currentPage === 'auth' ? 'flex' : 'initial',
            justifyContent: currentPage === 'auth' ? 'center' : 'initial', // Keeps vertical center
            padding: currentPage === 'auth' ? '20px' : 'initial' // Keep padding
        }}>
          {renderPage()}
        </main>
        
        <Footer
            footerCategories={footerCategories}
            footerPolicies={footerPolicies}
            toUrlFriendly={toUrlFriendly}
        />
      </div>
    </div>
  );
}

export default App;
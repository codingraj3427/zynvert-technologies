import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/layout/Header/Header";
import Footer from "./components/layout/Footer/Footer";
import AuthPage from "./pages/Auth/AuthPage";
import CartPage from "./pages/Cart/CartPage";
import ContactPage from "./pages/Contact/ContactPage"; // Assuming this is imported
import ShopPage from "./pages/Shop/ShopPage"; // Assuming this is imported
import ProductDetailPage from "./pages/Product/ProductDetailPage"; // Assuming this is imported
import HeroSection from "./pages/Home/HeroSection";
import PopularCategories from "./pages/Home/PopularCategories";
import FeaturedProducts from "./pages/Home/FeaturedProducts";
import ProductSlider from "./pages/Home/ProductSlider"; // Assuming this is imported
import ShowcaseSection from "./pages/Home/ShowcaseSection";
import ContactSection from "./pages/Home/ContactSection";
import PageLoader from "./components/common/LoadingSpinner/LoadingSpinner";

// ======== MOCK DATA (Using minimal, consistent structure) ========
const popularCategories = [
  /* ... */
];
const featuredProducts = [
  /* ... */
];
const recentlyLaunchedProducts = [
  /* ... */
  {
    id: "bms-2s", // ADDED ID
    name: "2S 4A BMS for LiFePO4 (LFP)",
    price: "₹99.00",
    oldPrice: "₹25.00",
    image: "https://placehold.co/200x200/eeeeee/333?text=2S+BMS",
  },
  {
    id: "shrink-tube", // ADDED ID
    name: "Heat Shrink Tube 290mm",
    price: "₹349.00",
    oldPrice: "₹119.00",
    image: "https://placehold.co/200x200/eeeeee/333?text=Tube",
  },
  {
    id: "daly-bms", // ADDED ID
    name: "Daly 4S 60A LiFePO4 BMS",
    price: "₹2,999.00",
    oldPrice: "₹1,199.00",
    image: "https://placehold.co/200x200/eeeeee/333?text=Daly+4S",
  },
  {
    id: "jbd-60a", // ADDED ID
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

// ======== HELPER FUNCTION ========
const toUrlFriendly = (text) =>
  text
    .toLowerCase()
    .replace(/ & /g, "-")
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

// Helper to safely get numeric price
const getNumericPrice = (product) => {
  return (
    product.numericPrice ||
    parseFloat(product.price?.replace(/[^\d.]/g, "")) ||
    0
  );
};

// ======== PAGE COMPONENTS ========
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
      onNavigate={onNavigate} // Passed navigation
      onAddToCart={onAddToCart} // ADDED CART PROP PASSING
    />
    <ContactSection />
  </>
);

// ======== MAIN APP COMPONENT FIX ========
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // FIXED: Centralized Cart State
  const [cartItems, setCartItems] = useState(INITIAL_CART_MOCK);

  // Calculate count from state for header badge
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // FIXED: Centralized Add to Cart Logic
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
            image: productToAdd.image, // Ensure all required properties are passed
          },
        ];
      }
    });
  };

  // FIXED: Centralized Quantity Change Logic
  const handleQuantityChange = (id, amount) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    );
  };

  // FIXED: Centralized Remove Item Logic
  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // FIXED: Centralized Navigation Logic
  const handleNavigate = (page, productId = null) => {
    setSelectedProduct(productId);
    setCurrentPage(page);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading) return;
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
  }, [isLoading, currentPage]);

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

    switch (currentPage) {
      case "auth":
        return <AuthPage />;
      case "cart":
        return (
          <CartPage
            onNavigate={handleNavigate}
            cartItems={cartItems}
            handleQuantityChange={handleQuantityChange} // FIXED: Now defined and passed
            removeItem={removeItem} // FIXED: Now defined and passed
          />
        );
      case "contact":
        return <ContactPage />;
      case "shop":
        return (
          <ShopPage onNavigate={handleNavigate} onAddToCart={handleAddToCart} />
        );
      case "home":
      default:
        return (
          <HomePage onNavigate={handleNavigate} onAddToCart={handleAddToCart} />
        );
    }
  };

  return (
    <div className="App">
      {isLoading && <PageLoader />}
      <div className={`app-content ${!isLoading ? "visible" : ""}`}>
        <Header
          onNavigate={handleNavigate}
          toUrlFriendly={toUrlFriendly}
          cartItemCount={cartItemCount}
        />
        <main>{renderPage()}</main>
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

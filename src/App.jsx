import React, { useState, useEffect, useCallback } from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";
import {
  loginSuccess,
  logoutUser,
  setLoading as setAuthLoading,
} from "./store/authSlice";

// Firebase
import { auth } from "./config/firebase";
import { onAuthStateChanged } from "firebase/auth";

// React Router
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import "./App.css";

// Layout
import Header from "./components/layout/Header/Header";
import Footer from "./components/layout/Footer/Footer";

// Common
import PageLoader from "./components/common/LoadingSpinner/LoadingSpinner";

// Pages
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
import AccountPage from "./pages/Account/AccountPage";

// Admin
import AdminLayout from "./pages/Admin/AdminLayout";

// ======== MOCK DATA (your real data can stay here) ========
const popularCategories = [
  /* ... keep your real data here ... */
];

const recentlyLaunchedProducts = [
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
  /* ... keep your real data here ... */
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

// ======== HELPERS ========
// safer toUrlFriendly (won’t crash if it gets an object)
const toUrlFriendly = (text) => {
  if (!text) return "";

  let str;
  if (typeof text === "string") {
    str = text;
  } else if (typeof text?.name === "string") {
    str = text.name;
  } else {
    str = String(text);
  }

  return str
    .toLowerCase()
    .replace(/ & /g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
};

const getNumericPrice = (product) => {
  if (typeof product === "number") return product;
  if (typeof product?.numericPrice === "number") return product.numericPrice;

  if (typeof product?.price === "string") {
    const num = parseFloat(product.price.replace(/[^\d.]/g, ""));
    return Number.isNaN(num) ? 0 : num;
  }

  return 0;
};

// ======== HOME PAGE COMPOSITION ========
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

// ======== PRODUCT DETAIL ROUTE WRAPPER ========
const ProductDetailRoute = ({ onNavigate, onAddToCart }) => {
  const { productId } = useParams();
  return (
    <ProductDetailPage
      productId={productId || "battery"}
      onNavigate={onNavigate}
      onAddToCart={onAddToCart}
    />
  );
};

// ======== MAIN SHELL (uses router hooks) ========
const AppShell = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading: authLoading, user } = useSelector(
    (state) => state.auth
  );

  // REMOVED: appIsLoading state and its useEffect timer logic

  const [dataLoaded, setDataLoaded] = useState(false);

  const [cartItems, setCartItems] = useState(INITIAL_CART_MOCK);
  const cartItemCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = location.pathname === "/auth";
  const isAdminRoute = location.pathname.startsWith("/admin");

  // ===== Cart handlers (No changes needed) =====
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
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  // ===== Navigation helper used by Header / cards (No changes needed) =====
  const handleNavigate = useCallback((page, productId = null) => {
    switch (page) {
      case "home":
      case "/": 
        navigate("/");
        break;
      case "shop":
        navigate("/shop");
        break;
      case "cart":
        navigate("/cart");
        break;
      case "contact":
        navigate("/contact");
        break;
      case "account":
        navigate("/account");
        break;
      case "auth":
      case "login":
        navigate("/auth");
        break;
      case "admin":
        navigate("/admin");
        break;
      case "product":
        navigate(`/product/${productId || "battery"}`);
        break;
      default:
        // allow direct path
        navigate(typeof page === "string" ? page : "/");
    }
  }, [navigate]);

  // ===== Simulated initial data load (No changes needed) =====
  useEffect(() => {
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setDataLoaded(true);
    };
    loadData();
  }, []);

  // ===== Firebase Auth Listener (No changes needed) =====
  useEffect(() => {
    dispatch(setAuthLoading(true));

    let currentPath = location.pathname;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        dispatch(loginSuccess(firebaseUser));

        if (currentPath === "/auth") {
          navigate("/", { replace: true });
        }
      } else {
        dispatch(logoutUser());
      }
      dispatch(setAuthLoading(false));
    });

    return () => unsubscribe();
  }, [dispatch, navigate, location.pathname]);

  // REMOVED: App loading controller useEffect

  // ===== Intersection Observer for section reveal =====
  useEffect(() => {
    // Only run this if we are not in a loading state
    if (authLoading || !dataLoaded) return;

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
  // Dependency updated to track auth/data state
  }, [authLoading, dataLoaded, location.pathname]);

  // ===== Simple auth guard components (No changes needed) =====
  const RequireAuth = ({ children, requireAdmin = false }) => {
    if (authLoading) {
      return <PageLoader />;
    }

    if (!isAuthenticated) {
      return <Navigate to="/auth" replace />;
    }

    if (requireAdmin) {
      const isAdmin =
        user?.role === "admin" ||
        user?.isAdmin === true ||
        user?.email === process.env.REACT_APP_ADMIN_EMAIL;

      if (!isAdmin) {
        return <Navigate to="/" replace />;
      }
    }

    return children;
  };

  // Reworked global loader check
  if (authLoading || !dataLoaded) {
    return <PageLoader />;
  }
  
  // FIX: This className was tied to the removed `appIsLoading` state. We can remove it
  // or default to visible if the component is rendered. Using "" for simplicity.
  // const appContentClass = !appIsLoading ? "visible" : ""; 
  const appContentClass = "visible";


  return (
    <div
      className="App"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <div
        className={`app-content ${appContentClass}`}
        style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        {/* Header visibility relies only on isAdminRoute */}
        {!isAdminRoute && (
          <Header
            onNavigate={handleNavigate}
            toUrlFriendly={toUrlFriendly}
            cartItemCount={cartItemCount}
          />
        )}

        {/* FIX: Simplified main styling. We rely on the App CSS for main layout, 
            only applying flex-center for auth pages. */}
        <main
          style={{
            flexGrow: 1,
            // Only apply flex styles for centering AuthPage
            display: isAuthPage ? "flex" : "block",
            justifyContent: isAuthPage ? "center" : "initial",
            alignItems: isAuthPage ? "center" : "initial", // Added align-items for better centering
            padding: isAuthPage ? "20px" : "initial",
          }}
        >
          <Routes>
            {/* Public site */}
            <Route
              path="/"
              element={
                <HomePage
                  onNavigate={handleNavigate}
                  onAddToCart={handleAddToCart}
                />
              }
            />
            <Route
              path="/shop"
              element={
                <ShopPage
                  onNavigate={handleNavigate}
                  onAddToCart={handleAddToCart}
                />
              }
            />
            <Route
              path="/product/:productId"
              element={
                <ProductDetailRoute
                  onNavigate={handleNavigate}
                  onAddToCart={handleAddToCart}
                />
              }
            />
            <Route
              path="/cart"
              element={
                <CartPage
                  onNavigate={handleNavigate}
                  cartItems={cartItems}
                  handleQuantityChange={handleQuantityChange}
                  removeItem={removeItem}
                />
              }
            />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/auth" element={<AuthPage />} />

            <Route
              path="/account"
              element={
                <RequireAuth>
                  <AccountPage onNavigate={handleNavigate} />
                </RequireAuth>
              }
            />

            {/* Admin panel – protected */}
            <Route
              path="/admin/*"
              element={
                <RequireAuth requireAdmin>
                  <AdminLayout />
                </RequireAuth>
              }
            />

            {/* 404 */}
            <Route
              path="*"
              element={
                <div style={{ padding: "4rem 1rem", textAlign: "center" }}>
                  <h1>404 - Page Not Found</h1>
                  <p>The page you are looking for does not exist.</p>
                </div>
              }
            />
          </Routes>
        </main>

        {/* Footer visibility relies only on isAdminRoute. 
            The structural changes to <main> ensure it is pushed down correctly. */}
        {!isAdminRoute && (
          <Footer
            footerCategories={footerCategories}
            footerPolicies={footerPolicies}
            toUrlFriendly={toUrlFriendly}
          />
        )}
      </div>
    </div>
  );
};

// ======== TOP-LEVEL APP WITH BROWSERROUTER ========
const App = () => (
  <BrowserRouter>
    <AppShell />
  </BrowserRouter>
);

export default App;
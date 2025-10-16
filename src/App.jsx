import React, { useState, useEffect} from "react";
import "./App.css";
import Header from "./components/layout/Header/Header";
import Footer from "./components/layout/Footer/Footer"; // This seems to be defined twice. Let's assume this is the correct one.
import AuthPage from "./pages/Auth/AuthPage";
import CartPage from "./pages/Cart/CartPage";
import HeroSection from "./pages/Home/HeroSection";
import PopularCategories from "./pages/Home/PopularCategories";
import FeaturedProducts from "./pages/Home/FeaturedProducts";
import ShowcaseSection from "./pages/Home/ShowcaseSection";
import ContactSection from "./pages/Home/ContactSection";
import PageLoader from "./components/common/LoadingSpinner/LoadingSpinner";

// ======== MOCK DATA ========



const popularCategories = [
  {
    name: "Lithium-Ion Batteries",
    image: "https://placehold.co/300x300/FF6B6B/ffffff?text=Li-Ion",
  },
  {
    name: "LiFePO4 Batteries",
    image: "https://placehold.co/300x300/4ECDC4/ffffff?text=LiFePO4",
  },
  {
    name: "Integrated Inverters",
    image: "https://placehold.co/300x300/3A3A3A/ffffff?text=Inverter",
  },
  {
    name: "Solar Inverters",
    image: "https://placehold.co/300x300/FF6B6B/ffffff?text=Solar",
  },
  { name: "BMS", image: "https://placehold.co/300x300/4ECDC4/ffffff?text=BMS" },
  {
    name: "Connectors & Wires",
    image: "https://placehold.co/300x300/3A3A3A/ffffff?text=Wires",
  },
];
const featuredProducts = [
  {
    name: "Zynvert 12V 100Ah LiFePO4 Battery",
    price: "₹15,999",
    image: "https://placehold.co/400x400/eeeeee/333333?text=Zynvert+100Ah",
  },
  {
    name: "Solar Integrated Inverter 3kW",
    price: "₹45,500",
    image: "https://placehold.co/400x400/eeeeee/333333?text=Solar+Inverter",
  },
  {
    name: "4S 100A BMS with Active Balancer",
    price: "₹2,499",
    image: "https://placehold.co/400x400/eeeeee/333333?text=4S+BMS",
  },
  {
    name: "High-Current DC Wires (10 Mtr)",
    price: "₹899",
    image: "https://placehold.co/400x400/eeeeee/333333?text=DC+Wires",
  },
];
const recentlyLaunchedProducts = [
  {
    name: "2S 4A BMS for LiFePO4 (LFP)",
    price: "₹99.00",
    oldPrice: "₹25.00",
    image: "https://placehold.co/200x200/eeeeee/333?text=2S+BMS",
  },
  {
    name: "Heat Shrink Tube 290mm",
    price: "₹349.00",
    oldPrice: "₹119.00",
    image: "https://placehold.co/200x200/eeeeee/333?text=Tube",
  },
  {
    name: "Daly 4S 60A LiFePO4 BMS",
    price: "₹2,999.00",
    oldPrice: "₹1,199.00",
    image: "https://placehold.co/200x200/eeeeee/333?text=Daly+4S",
  },
  {
    name: "Jiabaida (JBD) 60A BMS",
    price: "₹2,999.00",
    oldPrice: "₹1,199.00",
    image: "https://placehold.co/200x200/eeeeee/333?text=JBD+BMS",
  },
];
const showcaseCategories = [
  "Amplifier Cabinets",
  "Amplifier Power",
  "Audio Boards",
  "AVR Boards",
  "Capacitors",
  "Connectors",
  "E-BIKE",
  "Home Audio",
  "Integrated Circuit",
  "Inverter Cabinets",
  "Inverter Kit",
  "Lithium Battery",
];
const footerCategories = [
  "Audio Boards",
  "Transformers",
  "AC TO DC Power Supply",
  "SMPS Boards",
  "Speakers",
  "AVR Boards",
  "Connector",
];
const footerPolicies = [
  "Privacy Policy",
  "Refund & Cancellations",
  "Terms & Conditions",
  "About Us",
];


// ======== HELPER FUNCTION ========
const toUrlFriendly = (text) =>
  text
    .toLowerCase()
    .replace(/ & /g, "-")
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

// ======== PAGE COMPONENTS ========



const HomePage = () => (
  <>
    <HeroSection />
    <PopularCategories popularCategories={popularCategories} />
    <FeaturedProducts featuredProducts={featuredProducts} />
    <ShowcaseSection
      recentlyLaunchedProducts={recentlyLaunchedProducts}
      showcaseCategories={showcaseCategories}
      toUrlFriendly={toUrlFriendly}
    />
    <ContactSection />
  </>
);


// ======== MAIN APP COMPONENT ========
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("home");

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
    switch (currentPage) {
      case "auth": return <AuthPage />;
      case "cart": return <CartPage onNavigate={setCurrentPage} />;
      case "home":
      default: return <HomePage />;
    }
  };

  return (
    <div className="App">
      {isLoading && <PageLoader />}
      <div className={`app-content ${!isLoading ? "visible" : ""}`}>
        <Header onNavigate={setCurrentPage} toUrlFriendly={toUrlFriendly} />
        <main>{renderPage()}</main>
        {currentPage === "home" && (
          <Footer
            footerCategories={footerCategories}
            footerPolicies={footerPolicies}
            toUrlFriendly={toUrlFriendly}
          />
        )}
      </div>
    </div>
  );
}

export default App;

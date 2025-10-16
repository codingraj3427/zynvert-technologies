import React, { useState, useEffect, useRef } from "react";
import GridIcon from "../../../assets/icons/GridIcon";

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

const Navbar = ({ onNavigate, toUrlFriendly }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    return (
        <nav className="navbar">
            <div className="navbar-left" ref={dropdownRef}>
                <button
                    className="categories-button"
                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                >
                    <GridIcon /> All Categories
                    <span className={`arrow ${isDropdownOpen ? "up" : "down"}`}></span>
                </button>
                {isDropdownOpen && (
                    <div className="dropdown-menu">
                        {navCategories.map((category) => (
                            <a
                                href={`/category/${toUrlFriendly(category.name)}`}
                                className="dropdown-item"
                                key={category.name}
                            >
                                <span>{category.name}</span>
                                <span className="chevron">›</span>
                            </a>
                        ))}
                    </div>
                )}
            </div>
            <div className="nav-links">
                <a href="#home" onClick={() => onNavigate("home")} className="nav-link active">Home</a>
                <a href="#shop" className="nav-link">Shop</a>
                <a href="#new-arrivals" className="nav-link">New Arrivals</a>
                <a href="#contact" className="nav-link">Contact</a>
            </div>
            <div className="nav-promo">
                <a href="/sale">SALE 30% OFF!</a>
            </div>
        </nav>
    );
};

export default Navbar;
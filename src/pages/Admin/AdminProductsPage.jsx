// src/pages/Admin/AdminProductsPage.jsx

import React, { useEffect, useState, useMemo } from "react";
import { adminService } from "../../services/admin.service";
import "./AdminProducts.css";

const defaultForm = {
  product_id: "",
  sku: "",
  stock_level: "",
  current_price: "",
  category_id: "",
  name: "",
  description: "",
  imagesText: "",
  technical_specs_text: "",
  isFeatured: false,
  showOnHome: false,
};

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  // product categories
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");

  // search + filter
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // ===== Helpers =====
  const getCategoryName = (categoryId) => {
    if (!categoryId) return "-";
    const cat = categories.find((c) => c.category_id === categoryId);
    return cat?.name || categoryId;
  };

  // 🔹 Central helper to read stock from product safely
  const extractStock = (p) => {
    const candidates = [
      p.stock_level,
      p.stockLevel,
      p.stock,
      p.quantity,
      p.available_stock,
    ];

    for (const val of candidates) {
      if (typeof val === "number") return val;
      if (typeof val === "string" && val.trim() !== "") {
        const n = Number(val);
        if (!Number.isNaN(n)) return n;
      }
    }
    return null; // means "no stock info"
  };

  // ===== Load products + categories on mount =====
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setCategoriesLoading(true);
        setError("");
        setCategoriesError("");

        const [productsRes, categoriesRes] = await Promise.all([
          adminService.getProducts(),
          adminService.getCategories(),
        ]);

        const list = Array.isArray(productsRes)
          ? productsRes
          : Array.isArray(productsRes?.products)
          ? productsRes.products
          : [];
        setProducts(list);

        const cats = Array.isArray(categoriesRes)
          ? categoriesRes
          : Array.isArray(categoriesRes?.categories)
          ? categoriesRes.categories
          : [];
        setCategories(cats);
      } catch (err) {
        console.error("Failed to load admin products/categories:", err);
        setError("Failed to load products");
        setCategoriesError("Failed to load categories");
      } finally {
        setLoading(false);
        setCategoriesLoading(false);
      }
    };

    loadData();
  }, []);

  const reloadProducts = async () => {
    try {
      const data = await adminService.getProducts();
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.products)
        ? data.products
        : [];
      setProducts(list);
    } catch (err) {
      console.error("Failed to reload products:", err);
    }
  };

  // ===== Form handlers =====
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const buildPayloadFromForm = () => {
    const productId =
      (form.product_id && String(form.product_id).trim()) ||
      `prod_${Date.now()}`;

    const name = form.name.trim();
    const categoryId = form.category_id.trim();
    const description = form.description.trim();

    const images = form.imagesText
      ? form.imagesText
          .split(/[\n,]/)
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const technical_specs = form.technical_specs_text
      ? { description: form.technical_specs_text }
      : undefined;

    const display_flags = [
      ...(form.isFeatured ? ["featured"] : []),
      ...(form.showOnHome ? ["home"] : []),
    ];

    return {
      product_id: productId,
      sku: form.sku || null,
      stock_level: Number(form.stock_level), // stock is always numeric in payload
      current_price: Number(form.current_price),
      category_id: categoryId,
      name,
      description,
      images,
      technical_specs,
      display_flags,
    };
  };

  const resetForm = () => {
    setForm(defaultForm);
    setEditingProductId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const payload = buildPayloadFromForm();

      if (editingProductId) {
        await adminService.updateProduct(editingProductId, payload);
      } else {
        await adminService.createProduct(payload);
      }

      resetForm();
      setShowForm(false);
      await reloadProducts();
    } catch (err) {
      console.error("Failed to save product:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save product";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (product) => {
    const id = product.product_id || product.id || product._id;
    if (!id) return;
    if (!window.confirm("Delete this product?")) return;

    try {
      await adminService.deleteProduct(id);
      setProducts((prev) =>
        prev.filter(
          (p) => p.product_id !== id && p.id !== id && p._id !== id
        )
      );
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete product"
      );
    }
  };

  const handleEdit = (p) => {
    setEditingProductId(p.product_id || p._id || p.id || null);

    const imagesText = Array.isArray(p.images)
      ? p.images.join("\n")
      : "";

    const technical_specs_text =
      p.technical_specs?.description ||
      (p.technical_specs
        ? JSON.stringify(p.technical_specs, null, 2)
        : "");

    const display_flags = Array.isArray(p.display_flags)
      ? p.display_flags
      : [];

    const stockVal = extractStock(p);

    setForm({
      product_id: p.product_id || "",
      sku: p.sku || "",
      stock_level:
        stockVal === null ? "" : String(stockVal), // prefill from helper
      current_price:
        typeof p.current_price === "number"
          ? String(p.current_price)
          : typeof p.price_display === "number"
          ? String(p.price_display)
          : "",
      category_id: p.category_id || "",
      name: p.name || "",
      description: p.description || "",
      imagesText,
      technical_specs_text,
      isFeatured: display_flags.includes("featured"),
      showOnHome: display_flags.includes("home"),
    });

    setShowForm(true);
  };

  // ===== Filtered + searched products =====
  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return products.filter((p) => {
      const matchesSearch =
        !term ||
        (p.name && p.name.toLowerCase().includes(term)) ||
        (p.sku && p.sku.toLowerCase().includes(term)) ||
        (p.product_id &&
          String(p.product_id).toLowerCase().includes(term));

      const matchesCategory =
        !categoryFilter || p.category_id === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  const totalVisibleProducts = filteredProducts.length;

  const selectedCategory = categoryFilter
    ? categories.find((c) => c.category_id === categoryFilter)
    : null;

  // 🔹 Use extractStock() here so total stock is correct
  const totalStockForSelectedCategory = useMemo(() => {
    if (!selectedCategory) return null;
    return filteredProducts.reduce((sum, p) => {
      const n = extractStock(p);
      return sum + (n === null ? 0 : n);
    }, 0);
  }, [filteredProducts, selectedCategory]);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Products</h1>
        <button
          className="admin-btn primary"
          onClick={() => {
            if (showForm && editingProductId) {
              resetForm();
            }
            setShowForm((v) => !v);
          }}
        >
          {showForm
            ? editingProductId
              ? "Close Edit"
              : "Close"
            : "Add Product"}
        </button>
      </div>

      {error && (
        <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>
      )}

      {/* ===== Filters / Search / Stats ===== */}
      <div className="admin-card admin-filters">
        <div className="filter-row">
          <div className="filter-item">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search by name, SKU, ID…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-item">
            <label>Filter by Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              disabled={categoriesLoading}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {categoriesError && (
              <small className="error-text">{categoriesError}</small>
            )}
          </div>

          <div className="filter-item stats">
            <p>
              <strong>Visible products:</strong> {totalVisibleProducts}
            </p>
            {selectedCategory && (
              <p>
                <strong>{selectedCategory.name}</strong>{" "}
                {totalStockForSelectedCategory !== null && (
                  <>
                    – Total stock:{" "}
                    {totalStockForSelectedCategory} units
                  </>
                )}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ===== Create / Edit Product Form ===== */}
      {showForm && (
        <form
          className="admin-card admin-product-form"
          onSubmit={handleSubmit}
        >
          <h2 style={{ marginTop: 0 }}>
            {editingProductId ? "Edit Product" : "Add Product"}
          </h2>

          <div className="form-row">
            <label>
              Product ID
              <input
                name="product_id"
                value={form.product_id}
                onChange={handleChange}
                placeholder="If empty, will be auto-generated"
              />
            </label>
            <label>
              SKU
              <input
                name="sku"
                value={form.sku}
                onChange={handleChange}
                placeholder="e.g. ZYN-100AH"
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Current Price (₹) *
              <input
                type="number"
                name="current_price"
                value={form.current_price}
                onChange={handleChange}
                required
                min="0"
              />
            </label>
            <label>
              Stock Level *
              <input
                type="number"
                name="stock_level"
                value={form.stock_level}
                onChange={handleChange}
                required
                min="0"
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Category *
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Name *
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              required
            />
          </label>

          <label>
            Images (one URL per line or comma-separated)
            <textarea
              name="imagesText"
              value={form.imagesText}
              onChange={handleChange}
              rows={3}
              placeholder={"https://...\nhttps://..."}
            />
          </label>

          <label>
            Technical Specs (free text / JSON)
            <textarea
              name="technical_specs_text"
              value={form.technical_specs_text}
              onChange={handleChange}
              rows={3}
              placeholder='e.g. "12V 100Ah LiFePO4, 3000 cycles"'
            />
          </label>

          <div className="form-row">
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleChange}
              />
              Featured
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                name="showOnHome"
                checked={form.showOnHome}
                onChange={handleChange}
              />
              Show on Home
            </label>
          </div>

          <button
            type="submit"
            className="admin-btn primary"
            disabled={submitting}
          >
            {submitting
              ? editingProductId
                ? "Updating..."
                : "Saving..."
              : editingProductId
              ? "Update Product"
              : "Save Product"}
          </button>
        </form>
      )}

      {/* ===== Products Table ===== */}
      <div className="admin-card">
        {loading ? (
          <p>Loading products…</p>
        ) : filteredProducts.length === 0 ? (
          <p>No products match the current filters.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Display Price</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => {
                const stockVal = extractStock(p);
                return (
                  <tr key={p.product_id || p._id}>
                    <td>{p.product_id}</td>
                    <td>{p.name}</td>
                    <td>{getCategoryName(p.category_id)}</td>
                    <td>{stockVal === null ? "-" : stockVal}</td>
                    <td>{p.price_display ?? p.current_price ?? "-"}</td>
                    <td>
                      <button
                        className="admin-btn secondary"
                        onClick={() => handleEdit(p)}
                        style={{ marginRight: 8 }}
                      >
                        Edit
                      </button>
                      <button
                        className="admin-btn danger"
                        onClick={() => handleDelete(p)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminProductsPage;

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

const MAX_IMAGES = 5;

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

  // drag & drop / image files
  const [imageFiles, setImageFiles] = useState([]); // [{id,file,name,size,previewUrl}]
  const [isDragging, setIsDragging] = useState(false);

  // ===== Helpers =====
  const getCategoryName = (categoryId) => {
    if (!categoryId) return "-";
    const cat = categories.find((c) => c.category_id === categoryId);
    return cat?.name || categoryId;
  };

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
    return null;
  };

  const getManualUrlsFromForm = () =>
    form.imagesText
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);

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

  const buildPayloadFromForm = (finalImages) => {
    const productId =
      (form.product_id && String(form.product_id).trim()) ||
      `prod_${Date.now()}`;

    const name = form.name.trim();
    const categoryId = form.category_id.trim();
    const description = form.description.trim();

    const images =
      Array.isArray(finalImages) && finalImages.length > 0
        ? finalImages
        : getManualUrlsFromForm();

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
      stock_level: Number(form.stock_level),
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
    // revoke all object URLs
    imageFiles.forEach((f) => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
    });

    setForm(defaultForm);
    setEditingProductId(null);
    setImageFiles([]);
    setIsDragging(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const manualUrls = getManualUrlsFromForm();
      const totalImagesCount = manualUrls.length + imageFiles.length;

      if (totalImagesCount === 0) {
        throw new Error("Please add at least one product image.");
      }

      if (totalImagesCount > MAX_IMAGES) {
        throw new Error(
          `You can upload a maximum of ${MAX_IMAGES} images per product. Currently you have ${totalImagesCount}.`
        );
      }

      // 1) Upload any newly added image files to backend (Cloudinary)
      let uploadedImageUrls = [];

      if (imageFiles.length > 0) {
        for (const fileObj of imageFiles) {
          try {
            const res = await adminService.uploadProductImage(fileObj.file);
            const url = res?.url || res?.secure_url || res;
            if (url) uploadedImageUrls.push(url);
          } catch (uploadErr) {
            console.error("Failed to upload image:", uploadErr);
            throw uploadErr;
          }
        }
      }

      // 2) Combine manual URLs + uploaded Cloudinary URLs
      const allImages = [...manualUrls, ...uploadedImageUrls];

      const payload = buildPayloadFromForm(allImages);

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
    // clear previous previews
    resetForm();

    setEditingProductId(p.product_id || p._id || p.id || null);

    const imagesText = Array.isArray(p.images) ? p.images.join("\n") : "";

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
      stock_level: stockVal === null ? "" : String(stockVal),
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

  // ===== Drag & drop helpers =====
  const appendFiles = (files) => {
    if (!files || files.length === 0) return;

    const currentManualCount = getManualUrlsFromForm().length;
    const currentFileCount = imageFiles.length;
    const remainingSlots = MAX_IMAGES - (currentManualCount + currentFileCount);

    if (remainingSlots <= 0) {
      setError(
        `You already have ${currentManualCount + currentFileCount} images. Max allowed is ${MAX_IMAGES}.`
      );
      return;
    }

    const incoming = Array.from(files).slice(0, remainingSlots);

    const fileObjects = incoming.map((file, index) => ({
      id: `${file.name}-${Date.now()}-${index}`,
      file,
      name: file.name,
      size: file.size,
      previewUrl: URL.createObjectURL(file),
    }));

    setImageFiles((prev) => [...prev, ...fileObjects]);
  };

  const handleFileInputChange = (e) => {
    const { files } = e.target;
    appendFiles(files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      appendFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const removeImageFile = (fileId) => {
    setImageFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === fileId);
      if (fileToRemove?.previewUrl) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      }
      return prev.filter((f) => f.id !== fileId);
    });
  };

  // NEW: remove a single URL-based image (existing image on edit)
    const removeManualUrl = async (index) => {
    const urls = getManualUrlsFromForm();
    const urlToRemove = urls[index];
    const newUrls = urls.filter((_, i) => i !== index);
    const newText = newUrls.join("\n");

    // Optimistic UI: remove from preview immediately
    setForm((prev) => ({
      ...prev,
      imagesText: newText,
    }));

    // If we are editing an existing product, also delete from backend + Cloudinary
    if (editingProductId && urlToRemove) {
      try {
        await adminService.deleteProductImage(editingProductId, urlToRemove);
      } catch (err) {
        console.error("Failed to delete image on server:", err);
        // Optional: show toast or revert UI if you want
      }
    }
  };



  // ===== Filtered products =====
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

  const totalStockForSelectedCategory = useMemo(() => {
    if (!selectedCategory) return null;
    return filteredProducts.reduce((sum, p) => {
      const n = extractStock(p);
      return sum + (n === null ? 0 : n);
    }, 0);
  }, [filteredProducts, selectedCategory]);

  const toggleForm = () => {
    if (showForm) {
      resetForm();
      setShowForm(false);
    } else {
      resetForm();
      setShowForm(true);
    }
  };

  // For preview section we want combined URLs (manual + existing images on edit)
const previewManualUrls = getManualUrlsFromForm();
  return (
    <div className="admin-products-page">
      {/* Header */}
      <div className="admin-products-header">
        <div>
          <h1>Products</h1>
          <p className="admin-products-subtitle">
            Manage your product catalog, pricing and inventory.
          </p>
        </div>

        <button
          className="admin-btn primary admin-products-main-btn"
          onClick={toggleForm}
        >
          {showForm ? "Back to Product List" : "+ Add Product"}
        </button>
      </div>

      {error && <p className="admin-error-text">{error}</p>}

      {/* ===== Add / Edit Product View ===== */}
      {showForm && (
        <div className="admin-card add-product-card">
          <form className="add-product-form" onSubmit={handleSubmit}>
            {/* Left: Images */}
            <div className="add-product-left">
              <h2 className="section-title">Product Images</h2>
              <p className="helper-text">
                Drag &amp; drop files or browse. You can upload a total of{" "}
                <strong>{MAX_IMAGES}</strong> images (files + URLs combined).
              </p>

              <div
                className={
                  "image-dropzone" + (isDragging ? " dragging" : "")
                }
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <div className="image-dropzone-icon">🖼️</div>
                <p className="image-dropzone-title">
                  Drag &amp; drop your images here
                </p>
                <p className="image-dropzone-subtitle">
                  or{" "}
                  <label className="image-browse-label">
                    Browse
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileInputChange}
                      style={{ display: "none" }}
                    />
                  </label>
                </p>
                <p className="image-dropzone-note">
                  Remaining slots:{" "}
                  {Math.max(
                    0,
                    MAX_IMAGES -
                      (imageFiles.length + previewManualUrls.length)
                  )}
                </p>
              </div>

              {/* Preview of selected files */}
              {imageFiles.length > 0 && (
                <div className="image-preview-section">
                  <h3 className="section-subtitle">File Previews</h3>
                  <div className="image-preview-grid">
                    {imageFiles.map((file) => (
                      <div
                        key={file.id}
                        className="image-preview-item"
                      >
                        <div className="image-preview-thumb-wrapper">
                          <img
                            src={file.previewUrl}
                            alt={file.name}
                            className="image-preview-thumb"
                          />
                        </div>
                        <div className="image-preview-meta">
                          <div className="image-file-name">
                            {file.name}
                          </div>
                          <div className="image-file-size">
                            {(file.size / 1024).toFixed(0)} KB
                          </div>
                        </div>
                        <button
                          type="button"
                          className="image-file-remove"
                          onClick={() => removeImageFile(file.id)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview of URL-based images */}
             {previewManualUrls.length > 0 && (
  <div className="image-preview-section">
    <h3 className="section-subtitle">URL Previews</h3>
    <div className="image-preview-grid">
      {previewManualUrls.map((url, idx) => (
        <div
          key={url + idx}
          className="image-preview-item"
        >
          <button
            type="button"
            className="image-file-remove"
            onClick={() => removeManualUrl(idx)}
          >
            ✕
          </button>
          <div className="image-preview-thumb-wrapper">
            <img
              src={url}
              alt={`Preview ${idx + 1}`}
              className="image-preview-thumb"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
          <div className="image-preview-meta">
            <div className="image-file-name">
              URL {idx + 1}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

              <label className="admin-product-form-label">
                Image URLs (one per line or comma-separated)
                <textarea
                  className="admin-input textarea"
                  name="imagesText"
                  value={form.imagesText}
                  onChange={handleChange}
                  rows={4}
                  placeholder={"https://...\nhttps://..."}
                />
              </label>
            </div>

            {/* Right: Product fields */}
            <div className="add-product-right">
              <h2 className="section-title">
                {editingProductId ? "Edit Product" : "Product Details"}
              </h2>

              <div className="two-column-grid">
                <label className="admin-product-form-label">
                  Product Name *
                  <input
                    className="admin-input"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label className="admin-product-form-label">
                  Category *
                  <select
                    className="admin-input"
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Category --</option>
                    {categories.map((cat) => (
                      <option
                        key={cat.category_id}
                        value={cat.category_id}
                      >
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="two-column-grid">
                <label className="admin-product-form-label">
                  Current Price (₹) *
                  <input
                    className="admin-input"
                    type="number"
                    name="current_price"
                    value={form.current_price}
                    onChange={handleChange}
                    required
                    min="0"
                  />
                </label>

                <label className="admin-product-form-label">
                  Stock Level *
                  <input
                    className="admin-input"
                    type="number"
                    name="stock_level"
                    value={form.stock_level}
                    onChange={handleChange}
                    required
                    min="0"
                  />
                </label>
              </div>

              <div className="two-column-grid">
                <label className="admin-product-form-label">
                  Product ID
                  <input
                    className="admin-input"
                    name="product_id"
                    value={form.product_id}
                    onChange={handleChange}
                    placeholder="If empty, will be auto-generated"
                  />
                </label>

                <label className="admin-product-form-label">
                  SKU
                  <input
                    className="admin-input"
                    name="sku"
                    value={form.sku}
                    onChange={handleChange}
                    placeholder="e.g. ZYN-100AH"
                  />
                </label>
              </div>

              <label className="admin-product-form-label">
                Description
                <textarea
                  className="admin-input textarea"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  required
                />
              </label>

              <label className="admin-product-form-label">
                Technical Specs (free text / JSON)
                <textarea
                  className="admin-input textarea"
                  name="technical_specs_text"
                  value={form.technical_specs_text}
                  onChange={handleChange}
                  rows={3}
                  placeholder='e.g. "12V 100Ah LiFePO4, 3000 cycles"'
                />
              </label>

              <div className="flags-row">
                <label className="flag-checkbox">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={form.isFeatured}
                    onChange={handleChange}
                  />
                  <span>Featured</span>
                </label>
                <label className="flag-checkbox">
                  <input
                    type="checkbox"
                    name="showOnHome"
                    checked={form.showOnHome}
                    onChange={handleChange}
                  />
                  <span>Show on Home</span>
                </label>
              </div>

              <div className="form-actions-row">
                <button
                  type="button"
                  className="admin-btn ghost"
                  onClick={toggleForm}
                  disabled={submitting}
                >
                  Cancel
                </button>
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
                    : "Publish Product"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ===== Product List View ===== */}
      {!showForm && (
        <>
          {/* Filters / stats */}
          <div className="admin-card admin-filters-card">
            <div className="filter-row">
              <div className="filter-item">
                <label className="filter-label">Search</label>
                <input
                  className="admin-input"
                  type="text"
                  placeholder="Search by name, SKU, ID…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="filter-item">
                <label className="filter-label">Category</label>
                <select
                  className="admin-input"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  disabled={categoriesLoading}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option
                      key={cat.category_id}
                      value={cat.category_id}
                    >
                      {cat.name}
                    </option>
                  ))}
                </select>
                {categoriesError && (
                  <small className="error-text">
                    {categoriesError}
                  </small>
                )}
              </div>

              <div className="filter-item stats">
                <p>
                  <strong>Visible products:</strong>{" "}
                  {totalVisibleProducts}
                </p>
                {selectedCategory && (
                  <p>
                    <strong>{selectedCategory.name}</strong>
                    {totalStockForSelectedCategory !== null && (
                      <>
                        {" "}
                        – Total stock:{" "}
                        {totalStockForSelectedCategory} units
                      </>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="admin-card admin-products-table-card">
            {loading ? (
              <p>Loading products…</p>
            ) : filteredProducts.length === 0 ? (
              <p>No products match the current filters.</p>
            ) : (
              <table className="admin-table pretty-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Flags</th>
                    <th className="actions-col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => {
                    const stockVal = extractStock(p);
                    const isFeatured = Array.isArray(p.display_flags)
                      ? p.display_flags.includes("featured")
                      : false;
                    const showOnHome = Array.isArray(p.display_flags)
                      ? p.display_flags.includes("home")
                      : false;

                    const mainImage =
                      Array.isArray(p.images) && p.images.length > 0
                        ? p.images[0]
                        : null;
                    const initial = (p.name || "?")
                      .charAt(0)
                      .toUpperCase();

                    return (
                      <tr key={p.product_id || p._id}>
                        <td>
                          <div className="product-cell">
                            <div className="product-avatar with-image">
                              {mainImage ? (
                                <img
                                  src={mainImage}
                                  alt={p.name}
                                  className="product-avatar-image"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                  }}
                                />
                              ) : (
                                <span className="product-avatar-initial">
                                  {initial}
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="product-name">{p.name}</div>
                              <div className="product-sub">
                                {p.sku || p.product_id || "-"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>{getCategoryName(p.category_id)}</td>
                        <td>₹{p.price_display ?? p.current_price ?? "-"}</td>
                        <td>{stockVal === null ? "-" : stockVal}</td>
                        <td>
                          <div className="flags-badges">
                            {isFeatured && (
                              <span className="badge badge-featured">
                                Featured
                              </span>
                            )}
                            {showOnHome && (
                              <span className="badge badge-home">
                                Home
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="actions-col">
                          <button
                            className="admin-btn secondary"
                            onClick={() => handleEdit(p)}
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
        </>
      )}
    </div>
  );
};

export default AdminProductsPage;

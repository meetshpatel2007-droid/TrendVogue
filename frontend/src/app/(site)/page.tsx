"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Sparkles,
  Truck,
  RefreshCw,
  ShieldCheck,
  Zap,
  ArrowRight,
  Star,
  Search,
  CheckCircle2,
  Box,
  MapPin,
  Heart,
  Eye,
} from "lucide-react";
import { formatCurrency, calculateDiscount } from "@/lib/utils";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  category: { name: string; slug: string };
  price: number;
  mrp: number;
  images: string[];
  stockQty: number;
  reviews?: { rating: number }[];
}

export default function LandingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("featured");

  // Live order tracker demo status
  const [trackerStatus, setTrackerStatus] = useState<string>("SHIPPED");

  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isInWishlist } = useWishlistStore();

  useEffect(() => {
    fetch("/api/products?limit=12")
      .then((r) => r.json())
      .then((d) => {
        if (d.data?.products) {
          setProducts(d.data.products);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (p: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: p.id,
      name: p.name,
      price: p.price,
      mrp: p.mrp,
      image: p.images[0] ?? "",
      size: "M",
      quantity: 1,
      stockQty: p.stockQty,
    });
    toast.success(`Added "${p.name}" to cart! 🛍️`);
  };

  const handleToggleWishlist = (p: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle({
      id: p.id,
      name: p.name,
      price: p.price,
      mrp: p.mrp,
      image: p.images[0] ?? "",
      categorySlug: p.category?.slug ?? "all",
    });
    const active = isInWishlist(p.id);
    toast(active ? "Removed from wishlist" : "Added to wishlist ❤️");
  };

  // Filtered and sorted products
  const filteredProducts = products.filter((p) => {
    const matchesCat =
      activeCategory === "all" ||
      p.category?.slug?.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  if (sortOption === "price_asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "price_desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  // Delivery tracker calculation
  const TRACKER_STEPS = ["ORDERED", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];
  const currentStepIdx = TRACKER_STEPS.indexOf(trackerStatus);
  const progressPercent = (currentStepIdx / (TRACKER_STEPS.length - 1)) * 100;

  return (
    <div style={{ position: "relative", overflowX: "hidden" }}>
      {/* ── Ambient Radial Glows ────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: "-5%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "1200px",
          height: "700px",
          background: "radial-gradient(ellipse at 50% 30%, rgba(33, 98, 161, 0.22) 0%, rgba(240, 136, 4, 0.08) 45%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── 1. LUXURY EDITORIAL HERO ────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          zIndex: 1,
          paddingTop: "clamp(100px, 12vw, 160px)",
          paddingBottom: "clamp(80px, 10vw, 130px)",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "clamp(2.5rem, 5vw, 5rem)",
              alignItems: "center",
            }}
          >
            {/* Left: Headline & Narrative */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Eyebrow badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.4rem 1rem",
                  background: "rgba(255, 216, 20, 0.08)",
                  border: "1px solid rgba(255, 216, 20, 0.25)",
                  borderRadius: "var(--radius-full)",
                  color: "var(--highlight)",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: "1.75rem",
                }}
              >
                <Zap size={14} />
                Monsoon Couture 2026
              </div>

              {/* Display Headline with generous whitespace */}
              <h1
                style={{
                  fontSize: "clamp(2.8rem, 6vw, 4.8rem)",
                  fontWeight: 800,
                  lineHeight: 1.05,
                  letterSpacing: "-0.035em",
                  marginBottom: "1.75rem",
                }}
              >
                Elegance in{" "}
                <br />
                <span
                  style={{
                    background: "var(--gradient-gold)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 4px 24px rgba(240, 136, 4, 0.3))",
                  }}
                >
                  Every Stitch.
                </span>
              </h1>

              {/* Subcopy */}
              <p
                style={{
                  fontSize: "clamp(1rem, 1.4vw, 1.15rem)",
                  color: "var(--text-secondary)",
                  lineHeight: 1.75,
                  maxWidth: "520px",
                  marginBottom: "2.5rem",
                  fontWeight: 400,
                }}
              >
                Explore bespoke tailoring, sustainably woven silk blends, and contemporary silhouettes engineered for effortless everyday luxury.
              </p>

              {/* Call to Actions (Zero exposed plaintext admin credentials) */}
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                <a href="#curated-styles" className="btn btn-gold btn-lg">
                  <ShoppingBag size={18} />
                  Explore Collection
                </a>

                <Link href="/admin" className="btn btn-secondary btn-lg" style={{ gap: "0.5rem" }}>
                  <ShieldCheck size={18} />
                  Admin Portal
                </Link>
              </div>
            </motion.div>

            {/* Right: Editorial Hero Image with Ken Burns zoom & floating glass badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: "relative" }}
            >
              <div
                style={{
                  position: "relative",
                  aspectRatio: "4/5",
                  borderRadius: "var(--radius-xl)",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-lg), 0 0 50px rgba(33, 98, 161, 0.2)",
                  border: "1px solid var(--border-glass)",
                  background: "var(--surface-2)",
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1000"
                  alt="Haute Couture Silk Evening Gown - Trend Vogue Editorial Campaign"
                  className="editorial-img animate-kenburns"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />

                {/* Soft Vignette Overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(10, 13, 16, 0.5) 100%)",
                    pointerEvents: "none",
                  }}
                />

                {/* Floating Glassmorphic Product Highlight */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="card-glass"
                  style={{
                    position: "absolute",
                    bottom: "1.75rem",
                    left: "1.75rem",
                    right: "1.75rem",
                    padding: "1rem 1.35rem",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#FFFFFF" }}>
                      Silk Drape Evening Gown
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--highlight)", fontWeight: 700 }}>
                      ₹4,299 · Best Seller Collection
                    </div>
                  </div>
                  <Link
                    href="/shop"
                    className="btn btn-sm btn-gold"
                    style={{ padding: "0.35rem 0.85rem", fontSize: "0.75rem" }}
                  >
                    View Piece
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 2. ELEGANT TRUST STRIP (With Thin Vertical Dividers) ────────── */}
      <section
        style={{
          borderTop: "1px solid var(--border-light)",
          borderBottom: "1px solid var(--border-light)",
          background: "var(--surface)",
          padding: "2.25rem 0",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "2rem",
              alignItems: "center",
            }}
          >
            {[
              {
                icon: Truck,
                title: "Free Metro Express Shipping",
                desc: "Complimentary priority dispatch on orders over ₹999",
                color: "var(--accent)",
                bg: "var(--accent-subtle)",
              },
              {
                icon: RefreshCw,
                title: "30-Day Easy Returns",
                desc: "Effortless pickup with full zero-fee refunds",
                color: "var(--amber)",
                bg: "rgba(240, 136, 4, 0.15)",
              },
              {
                icon: ShieldCheck,
                title: "100% Certified Authentic",
                desc: "Ethically sourced GOTS-grade organic fabrics",
                color: "var(--success)",
                bg: "var(--success-bg)",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.15rem",
                    padding: "0.5rem 1rem",
                    borderRight: i < 2 ? "1px solid var(--border-light)" : "none",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "var(--radius-md)",
                      background: item.bg,
                      color: item.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. CURATED STYLES CATALOG GRID ──────────────────────────────── */}
      <section
        id="curated-styles"
        style={{
          paddingTop: "clamp(80px, 10vw, 130px)",
          paddingBottom: "clamp(80px, 10vw, 130px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="container">
          {/* Section Header with Serif Accent */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "3rem",
              flexWrap: "wrap",
              gap: "1.5rem",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  color: "var(--accent)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: "0.4rem",
                }}
              >
                Seasonal Lookbook
              </div>
              <h2
                style={{
                  fontSize: "clamp(2rem, 4vw, 2.75rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                }}
              >
                Curated <span className="font-serif italic font-normal text-[1.1em]">Styles</span>
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "0.35rem" }}>
                Handpicked couture pieces and seasonal essentials
              </p>
            </div>

            {/* Category Chips, Search & Sort */}
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
              {/* Category Pills */}
              <div style={{ display: "flex", gap: "0.4rem", background: "var(--surface)", padding: "4px", borderRadius: "var(--radius-full)", border: "1px solid var(--border)" }}>
                {["all", "men", "women", "kids", "beauty"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setActiveCategory(c)}
                    style={{
                      padding: "0.4rem 0.9rem",
                      borderRadius: "var(--radius-full)",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer",
                      background: activeCategory === c ? "var(--accent)" : "transparent",
                      color: activeCategory === c ? "#FFFFFF" : "var(--text-secondary)",
                      transition: "all 0.2s",
                      textTransform: "capitalize",
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div style={{ position: "relative", width: "220px" }}>
                <input
                  type="text"
                  placeholder="Search styles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: "2.25rem", height: "38px", fontSize: "0.82rem" }}
                />
                <Search
                  size={14}
                  style={{
                    position: "absolute",
                    left: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-faint)",
                  }}
                />
              </div>

              {/* Sort */}
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                style={{ width: "150px", height: "38px", fontSize: "0.82rem", fontWeight: 600 }}
              >
                <option value="featured">Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Grid (4 cols desktop, 2 cols tablet, 1 col mobile) */}
          {loading ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "1.75rem",
              }}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{ aspectRatio: "3/4", borderRadius: "var(--radius-lg)" }} className="skeleton" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="card empty-state" style={{ padding: "4rem 1rem", textAlign: "center" }}>
              <p style={{ fontWeight: 700, fontSize: "1.1rem" }}>No styles matching your selection</p>
              <button
                onClick={() => {
                  setActiveCategory("all");
                  setSearchQuery("");
                }}
                className="btn btn-primary btn-sm"
                style={{ marginTop: "1rem" }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "1.75rem",
              }}
            >
              <AnimatePresence>
                {filteredProducts.map((product, idx) => {
                  const discount = calculateDiscount(product.price, product.mrp);
                  const isWish = isInWishlist(product.id);
                  const isLowStock = product.stockQty <= 5 && product.stockQty > 0;

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                    >
                      <div className="card card-hover" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
                        {/* Image Container with Inner Glass Border */}
                        <div
                          style={{
                            position: "relative",
                            aspectRatio: "3/4",
                            background: "var(--surface-2)",
                            overflow: "hidden",
                          }}
                        >
                          <Link href={`/product/${product.id}`} style={{ display: "block", width: "100%", height: "100%" }}>
                            {product.images[0] && (
                              <img
                                src={product.images[0]}
                                alt={`${product.name} - ${product.category?.name ?? "Apparel"}`}
                                className="editorial-img"
                                loading="lazy"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            )}
                          </Link>

                          {/* Wishlist Heart Button */}
                          <button
                            onClick={(e) => handleToggleWishlist(product, e)}
                            style={{
                              position: "absolute",
                              top: "12px",
                              right: "12px",
                              width: "36px",
                              height: "36px",
                              borderRadius: "var(--radius-full)",
                              background: isWish ? "var(--error)" : "rgba(10, 13, 16, 0.65)",
                              backdropFilter: "blur(10px)",
                              border: "1px solid rgba(255,255,255,0.15)",
                              color: "#FFFFFF",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              transition: "all 0.2s",
                              zIndex: 2,
                            }}
                            title={isWish ? "Remove from wishlist" : "Add to wishlist"}
                          >
                            <Heart size={16} fill={isWish ? "#FFFFFF" : "none"} />
                          </button>

                          {/* Sale Badge */}
                          {discount >= 10 && (
                            <span
                              className="badge badge-sale"
                              style={{ position: "absolute", bottom: "12px", left: "12px", zIndex: 2 }}
                            >
                              {discount}% OFF
                            </span>
                          )}

                          {/* Low Stock Badge */}
                          {isLowStock && (
                            <span
                              className="badge badge-low"
                              style={{ position: "absolute", top: "12px", left: "12px", zIndex: 2 }}
                            >
                              Only {product.stockQty} left
                            </span>
                          )}
                        </div>

                        {/* Product Meta */}
                        <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", flex: 1 }}>
                          <div
                            style={{
                              fontSize: "0.72rem",
                              color: "var(--accent)",
                              fontWeight: 800,
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                              marginBottom: "0.3rem",
                            }}
                          >
                            {product.category?.name ?? "Collection"}
                          </div>

                          <Link
                            href={`/product/${product.id}`}
                            style={{
                              fontWeight: 700,
                              fontSize: "1rem",
                              color: "var(--text-primary)",
                              textDecoration: "none",
                              marginBottom: "0.5rem",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {product.name}
                          </Link>

                          {/* Price & Action Row */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginTop: "auto",
                              paddingTop: "0.85rem",
                              borderTop: "1px solid var(--border-light)",
                            }}
                          >
                            <div>
                              <span style={{ fontWeight: 800, fontSize: "1.15rem", color: "var(--text-primary)" }}>
                                {formatCurrency(product.price)}
                              </span>
                              {product.mrp > product.price && (
                                <span
                                  style={{
                                    fontSize: "0.8rem",
                                    color: "var(--text-faint)",
                                    textDecoration: "line-through",
                                    marginLeft: "0.35rem",
                                  }}
                                >
                                  {formatCurrency(product.mrp)}
                                </span>
                              )}
                            </div>

                            <button
                              onClick={(e) => handleAddToCart(product, e)}
                              className="btn btn-primary btn-sm"
                              style={{ gap: "0.35rem", padding: "0.45rem 0.9rem" }}
                            >
                              <ShoppingBag size={14} /> Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* ── 4. DETERMINISTIC DELIVERY PIPELINE DEMO WIDGET ──────────────── */}
      <section
        style={{
          paddingBottom: "clamp(80px, 10vw, 140px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="container">
          <div
            className="card"
            style={{
              padding: "clamp(1.5rem, 4vw, 2.5rem)",
              border: "1px solid rgba(33, 98, 161, 0.4)",
              background: "linear-gradient(145deg, rgba(17, 22, 29, 0.98), rgba(24, 32, 42, 0.95))",
              boxShadow: "var(--shadow-lg), 0 0 40px rgba(33, 98, 161, 0.2)",
            }}
          >
            {/* Widget Top Bar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "2rem",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <span className="badge badge-metro">LIVE DISPATCH PIPELINE</span>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-faint)" }}>Order #TV-948201</span>
                </div>
                <h3 style={{ fontSize: "1.45rem", fontWeight: 800 }}>Deterministic Delivery Tracking</h3>
              </div>

              {/* Status Simulation Dropdown */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>
                  Simulate Status:
                </span>
                <select
                  value={trackerStatus}
                  onChange={(e) => {
                    setTrackerStatus(e.target.value);
                    toast.success(`Fulfillment pipeline updated to: ${e.target.value}`);
                  }}
                  style={{ width: "180px", height: "38px", fontWeight: 700, fontSize: "0.82rem" }}
                >
                  <option value="ORDERED">1. Order Placed</option>
                  <option value="PACKED">2. Packed in Hub</option>
                  <option value="SHIPPED">3. Shipped / In Transit</option>
                  <option value="OUT_FOR_DELIVERY">4. Out for Delivery</option>
                  <option value="DELIVERED">5. Delivered 🎉</option>
                </select>
              </div>
            </div>

            {/* 5-Step Animated Tracker */}
            <div style={{ position: "relative", margin: "2.5rem 0" }}>
              {/* Connecting Background Line */}
              <div
                style={{
                  position: "absolute",
                  top: "22px",
                  left: "30px",
                  right: "30px",
                  height: "3px",
                  background: "var(--surface-3)",
                  zIndex: 0,
                }}
              >
                {/* Active Progress Filling Line */}
                <div
                  style={{
                    height: "100%",
                    width: `${progressPercent}%`,
                    background: "var(--gradient-accent)",
                    transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
              </div>

              {/* 5 Milestone Step Nodes */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {[
                  { step: "ORDERED", label: "Ordered", icon: Box },
                  { step: "PACKED", label: "Packed", icon: Box },
                  { step: "SHIPPED", label: "Shipped", icon: Truck },
                  { step: "OUT_FOR_DELIVERY", label: "Out for Delivery", icon: MapPin },
                  { step: "DELIVERED", label: "Delivered", icon: CheckCircle2 },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  const isCompleted = idx < currentStepIdx;
                  const isActive = idx === currentStepIdx;

                  return (
                    <div
                      key={item.step}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.6rem",
                        width: "85px",
                      }}
                    >
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "var(--radius-full)",
                          background: isCompleted
                            ? "var(--accent)"
                            : isActive
                            ? "var(--amber)"
                            : "var(--surface-2)",
                          border: `2px solid ${
                            isCompleted ? "var(--accent)" : isActive ? "var(--amber)" : "var(--border)"
                          }`,
                          color: isCompleted ? "#FFFFFF" : isActive ? "#0A0D10" : "var(--text-faint)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.4s ease",
                          transform: isActive ? "scale(1.15)" : "scale(1)",
                          boxShadow: isActive ? "0 0 20px rgba(240, 136, 4, 0.45)" : "none",
                        }}
                      >
                        <Icon size={18} />
                      </div>

                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: isActive || isCompleted ? 700 : 500,
                          color: isActive
                            ? "var(--amber)"
                            : isCompleted
                            ? "var(--text-primary)"
                            : "var(--text-faint)",
                          textAlign: "center",
                        }}
                      >
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Destination & Carrier Details */}
            <div
              style={{
                background: "var(--surface-2)",
                padding: "1.15rem 1.5rem",
                borderRadius: "var(--radius-md)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "0.85rem",
                flexWrap: "wrap",
                gap: "0.75rem",
                border: "1px solid var(--border-light)",
              }}
            >
              <div>
                📍 Destination: <strong>Mumbai Metro Hub (PIN 400001)</strong>
              </div>
              <div>
                ⚡ Carrier: <strong>BlueDart Priority Air Express</strong>
              </div>
              <div>
                Estimated Delivery:{" "}
                <strong style={{ color: "var(--highlight)" }}>
                  {trackerStatus === "DELIVERED"
                    ? "Delivered to Customer"
                    : trackerStatus === "OUT_FOR_DELIVERY"
                    ? "Arriving Today by 4 PM"
                    : "Tomorrow by 8 PM"}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

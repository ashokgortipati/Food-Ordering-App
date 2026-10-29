import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { UtensilsCrossed, ShoppingBag, ShieldCheck, Menu, X, Compass, Clock } from "lucide-react";

export default function Navbar() {
  const { cartCount, cartSubtotal } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={closeMobileMenu}>
          <div className="brand-icon-wrapper">
            <UtensilsCrossed size={22} className="brand-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-title">Feast<span className="brand-accent">Hub</span></span>
            <span className="brand-tagline">Gourmet Portal</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-desktop-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            <Compass size={17} />
            <span>Restaurants</span>
          </NavLink>

          <NavLink
            to="/menu"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            <UtensilsCrossed size={17} />
            <span>Browse Foods</span>
          </NavLink>

          <NavLink
            to="/orders"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            <Clock size={17} />
            <span>Track Orders</span>
          </NavLink>

          <NavLink
            to="/admin"
            className={({ isActive }) => (isActive ? "nav-link nav-link-admin active" : "nav-link nav-link-admin")}
          >
            <ShieldCheck size={17} />
            <span>Admin Portal</span>
          </NavLink>
        </nav>

        {/* Actions: Cart & Mobile Toggle */}
        <div className="navbar-actions">
          <Link to="/cart" className="cart-badge-button" onClick={closeMobileMenu} id="cart-button">
            <div className="cart-icon-box">
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
            </div>
            <div className="cart-price-info">
              <span className="cart-label">My Cart</span>
              <span className="cart-amount">${cartSubtotal.toFixed(2)}</span>
            </div>
          </Link>

          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={closeMobileMenu}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div className="brand-logo">
                <div className="brand-icon-wrapper">
                  <UtensilsCrossed size={20} className="brand-icon" />
                </div>
                <span className="brand-title">Feast<span className="brand-accent">Hub</span></span>
              </div>
              <button className="mobile-close-btn" onClick={closeMobileMenu}>
                <X size={20} />
              </button>
            </div>

            <nav className="mobile-nav-list">
              <NavLink
                to="/"
                end
                className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}
                onClick={closeMobileMenu}
              >
                <Compass size={18} />
                <span>Restaurants</span>
              </NavLink>

              <NavLink
                to="/menu"
                className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}
                onClick={closeMobileMenu}
              >
                <UtensilsCrossed size={18} />
                <span>Browse Foods</span>
              </NavLink>

              <NavLink
                to="/orders"
                className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}
                onClick={closeMobileMenu}
              >
                <Clock size={18} />
                <span>Track Orders</span>
              </NavLink>

              <NavLink
                to="/cart"
                className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}
                onClick={closeMobileMenu}
              >
                <ShoppingBag size={18} />
                <span>Shopping Cart ({cartCount})</span>
              </NavLink>

              <NavLink
                to="/admin"
                className={({ isActive }) => (isActive ? "mobile-nav-item admin-item active" : "mobile-nav-item admin-item")}
                onClick={closeMobileMenu}
              >
                <ShieldCheck size={18} />
                <span>Restaurant Admin Portal</span>
              </NavLink>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

import { Link } from "react-router-dom";
import { UtensilsCrossed, Heart, ShieldCheck, Truck, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="portal-footer">
      <div className="footer-top-strip">
        <div className="footer-strip-container">
          <div className="strip-feature">
            <Truck size={20} className="strip-icon" />
            <div>
              <strong>Superfast Delivery</strong>
              <span>Average 30 mins delivery time</span>
            </div>
          </div>
          <div className="strip-feature">
            <UtensilsCrossed size={20} className="strip-icon" />
            <div>
              <strong>Gourmet Quality</strong>
              <span>Curated top-rated partner kitchens</span>
            </div>
          </div>
          <div className="strip-feature">
            <Clock size={20} className="strip-icon" />
            <div>
              <strong>Live Order Tracking</strong>
              <span>Real-time status updates</span>
            </div>
          </div>
          <div className="strip-feature">
            <ShieldCheck size={20} className="strip-icon" />
            <div>
              <strong>Admin Control</strong>
              <span>Full CRUD & inventory dashboard</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-container">
          <div className="footer-brand-column">
            <div className="footer-logo">
              <div className="brand-icon-wrapper">
                <UtensilsCrossed size={20} />
              </div>
              <span className="brand-title">Feast<span className="brand-accent">Hub</span></span>
            </div>
            <p className="footer-tagline">
              Connecting food enthusiasts with the finest artisanal kitchens. Seamless online ordering, live order progression, and robust restaurant management.
            </p>
          </div>

          <div className="footer-links-column">
            <h4 className="footer-column-title">Explore</h4>
            <ul className="footer-nav-list">
              <li><Link to="/">Partner Restaurants</Link></li>
              <li><Link to="/menu">Curated Food Catalog</Link></li>
              <li><Link to="/cart">My Shopping Cart</Link></li>
              <li><Link to="/orders">Order Tracking</Link></li>
            </ul>
          </div>

          <div className="footer-links-column">
            <h4 className="footer-column-title">Management</h4>
            <ul className="footer-nav-list">
              <li><Link to="/admin">Admin Dashboard</Link></li>
              <li><Link to="/admin?tab=foods">Food Items Management</Link></li>
              <li><Link to="/admin?tab=orders">Incoming Orders</Link></li>
              <li><Link to="/admin?tab=restaurants">Restaurant Partners</Link></li>
            </ul>
          </div>

          <div className="footer-links-column">
            <h4 className="footer-column-title">API Integration</h4>
            <div className="api-badge-card">
              <span className="api-status-dot"></span>
              <div>
                <strong>REST Mock Server</strong>
                <p>JSON Server on port 3000</p>
              </div>
            </div>
            <p className="footer-api-hint">
              All restaurant data, food menus, and customer orders are dynamically synchronized via REST endpoints.
            </p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>© {new Date().getFullYear()} FeastHub Portal. Built with React.js & JSON Server REST API.</p>
          <div className="footer-bottom-badge">
            <span>Crafted with</span>
            <Heart size={14} className="heart-icon" />
            <span>for culinary excellence</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

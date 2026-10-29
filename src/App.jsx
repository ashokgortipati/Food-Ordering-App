import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ToastContainer from "./components/ToastContainer";
import HomePage from "./pages/HomePage";
import RestaurantDetailPage from "./pages/RestaurantDetailPage";
import FoodCatalogPage from "./pages/FoodCatalogPage";
import CartPage from "./pages/CartPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import AdminPage from "./pages/AdminPage";
import { UtensilsCrossed } from "lucide-react";
import "./App.css";

function NotFoundPage() {
  return (
    <div className="section-container page-error-wrapper" style={{ padding: "100px 20px" }}>
      <UtensilsCrossed size={60} className="empty-icon" />
      <h2>404 - Page Not Found</h2>
      <p>The culinary page you are searching for does not exist or has been relocated.</p>
      <Link to="/" className="btn btn-primary">
        Return to Home
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <div className="app-root">
      <ToastContainer />
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
          <Route path="/menu" element={<FoodCatalogPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrderTrackingPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

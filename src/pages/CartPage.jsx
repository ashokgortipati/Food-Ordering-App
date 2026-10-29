import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { addOrder } from "../services/api";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Truck,
  CreditCard,
  Banknote,
  UtensilsCrossed,
  Phone,
  User,
  MapPin,
  FileText
} from "lucide-react";

export default function CartPage() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    deliveryFee,
    taxAmount,
    cartTotal
  } = useCart();

  const { showToast } = useToast();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    deliveryAddress: "",
    deliveryNotes: "",
    paymentMethod: "Card"
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!formData.customerName.trim()) {
      errors.customerName = "Customer name is required";
    }
    if (!formData.customerPhone.trim()) {
      errors.customerPhone = "Contact phone number is required";
    } else if (!/^[0-9+()\s-]{7,20}$/.test(formData.customerPhone.trim())) {
      errors.customerPhone = "Please enter a valid phone number";
    }
    if (!formData.deliveryAddress.trim()) {
      errors.deliveryAddress = "Complete delivery address is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Place Order handler
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      showToast("Your cart is empty. Add some delicious dishes first!", "error");
      return;
    }

    if (!validateForm()) {
      showToast("Please fill in all required customer details.", "error");
      return;
    }

    try {
      setIsSubmitting(true);

      // Construct order payload matching DB specification
      const newOrderPayload = {
        customerName: formData.customerName.trim(),
        customerPhone: formData.customerPhone.trim(),
        deliveryAddress: formData.deliveryAddress.trim(),
        deliveryNotes: formData.deliveryNotes.trim(),
        paymentMethod: formData.paymentMethod,
        items: cartItems.map((item) => ({
          foodId: item.foodId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          restaurantName: item.restaurantName
        })),
        totalAmount: cartTotal,
        orderStatus: "Placed",
        createdAt: new Date().toISOString()
      };

      // Send POST request to JSON Server via API service
      const createdOrder = await addOrder(newOrderPayload);

      // Clear the shopping cart
      clearCart();

      // Show success toast
      showToast(`Order #${createdOrder.id} placed successfully!`, "success");

      // Navigate to order tracking page
      navigate(`/orders?orderId=${createdOrder.id}`);
    } catch (err) {
      console.error("Order placement failed:", err);
      showToast("Failed to place order. Ensure JSON Server is running.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="section-container empty-cart-wrapper">
          <div className="empty-cart-card">
            <div className="empty-cart-icon-wrapper">
              <ShoppingBag size={56} className="empty-cart-icon" />
            </div>
            <h2>Your Shopping Cart is Empty</h2>
            <p>
              Looks like you haven&apos;t added any delicious dishes yet. Explore our top partner restaurants and curated menus to start ordering!
            </p>
            <div className="empty-cart-actions">
              <Link to="/" className="btn btn-primary btn-lg">
                <UtensilsCrossed size={18} />
                <span>Browse Restaurants</span>
              </Link>
              <Link to="/menu" className="btn btn-secondary btn-lg">
                <span>View Full Menu</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="section-container">
        {/* Page Header */}
        <div className="cart-page-header">
          <div>
            <h1 className="page-heading">Review Order & Checkout</h1>
            <p className="page-subheading">
              Complete your order details below to receive doorstep culinary delivery.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-text-danger"
            onClick={clearCart}
          >
            <Trash2 size={15} />
            <span>Clear Cart</span>
          </button>
        </div>

        {/* 2-Column Layout: Cart Items & Checkout Form */}
        <div className="cart-grid-layout">
          {/* Column 1: Items in Cart */}
          <div className="cart-items-column">
            <div className="cart-items-card">
              <div className="card-header-bar">
                <h3>Order Items ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})</h3>
                <span className="cart-delivery-pill">
                  <Truck size={14} />
                  <span>30 mins delivery</span>
                </span>
              </div>

              <div className="cart-item-list">
                {cartItems.map((item) => (
                  <div key={item.foodId} className="cart-item-row">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-item-thumbnail"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";
                      }}
                    />

                    <div className="cart-item-details">
                      <h4 className="cart-item-name">{item.name}</h4>
                      <span className="cart-item-restaurant">{item.restaurantName}</span>
                      <span className="cart-item-unit-price">${item.price.toFixed(2)} each</span>
                    </div>

                    <div className="cart-item-controls">
                      <div className="quantity-stepper">
                        <button
                          type="button"
                          className="stepper-btn"
                          onClick={() => updateQuantity(item.foodId, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="stepper-count">{item.quantity}</span>
                        <button
                          type="button"
                          className="stepper-btn"
                          onClick={() => updateQuantity(item.foodId, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <div className="cart-item-subtotal">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>

                      <button
                        type="button"
                        className="cart-item-delete-btn"
                        onClick={() => removeFromCart(item.foodId)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Price Breakdown */}
            <div className="order-summary-box">
              <h3 className="summary-title">Bill Breakdown</h3>

              <div className="summary-row">
                <span>Items Subtotal</span>
                <span>${cartSubtotal.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Estimated Delivery Fee</span>
                {deliveryFee === 0 ? (
                  <span className="free-badge">FREE (Over $35)</span>
                ) : (
                  <span>${deliveryFee.toFixed(2)}</span>
                )}
              </div>

              <div className="summary-row">
                <span>Taxes & Restaurant Packaging (5%)</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row summary-total-row">
                <span>Total Amount</span>
                <span className="total-highlight">${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Customer Delivery & Payment Form */}
          <div className="cart-form-column">
            <form onSubmit={handlePlaceOrder} className="checkout-form-card" id="checkout-form">
              <div className="checkout-card-header">
                <h3>Delivery & Contact Details</h3>
                <span className="secure-badge">
                  <ShieldCheck size={14} />
                  <span>Secure Order</span>
                </span>
              </div>

              {/* Customer Name */}
              <div className="form-field">
                <label htmlFor="customerName" className="form-label">
                  <User size={15} />
                  <span>Full Name *</span>
                </label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  className={`form-input ${formErrors.customerName ? "input-error" : ""}`}
                  placeholder="e.g. Eleanor Vance"
                  value={formData.customerName}
                  onChange={handleInputChange}
                />
                {formErrors.customerName && (
                  <span className="field-error-message">{formErrors.customerName}</span>
                )}
              </div>

              {/* Customer Phone */}
              <div className="form-field">
                <label htmlFor="customerPhone" className="form-label">
                  <Phone size={15} />
                  <span>Phone Number *</span>
                </label>
                <input
                  type="tel"
                  id="customerPhone"
                  name="customerPhone"
                  className={`form-input ${formErrors.customerPhone ? "input-error" : ""}`}
                  placeholder="e.g. +1 (555) 019-2834"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                />
                {formErrors.customerPhone && (
                  <span className="field-error-message">{formErrors.customerPhone}</span>
                )}
              </div>

              {/* Delivery Address */}
              <div className="form-field">
                <label htmlFor="deliveryAddress" className="form-label">
                  <MapPin size={15} />
                  <span>Delivery Address *</span>
                </label>
                <textarea
                  id="deliveryAddress"
                  name="deliveryAddress"
                  rows="3"
                  className={`form-textarea ${formErrors.deliveryAddress ? "input-error" : ""}`}
                  placeholder="Apartment / Suite, Street address, City, Postal Code"
                  value={formData.deliveryAddress}
                  onChange={handleInputChange}
                ></textarea>
                {formErrors.deliveryAddress && (
                  <span className="field-error-message">{formErrors.deliveryAddress}</span>
                )}
              </div>

              {/* Special Delivery Notes */}
              <div className="form-field">
                <label htmlFor="deliveryNotes" className="form-label">
                  <FileText size={15} />
                  <span>Delivery Instructions (Optional)</span>
                </label>
                <input
                  type="text"
                  id="deliveryNotes"
                  name="deliveryNotes"
                  className="form-input"
                  placeholder="e.g. Ring bell twice, leave at front door"
                  value={formData.deliveryNotes}
                  onChange={handleInputChange}
                />
              </div>

              {/* Payment Method Selector */}
              <div className="form-field">
                <label className="form-label">
                  <CreditCard size={15} />
                  <span>Payment Method</span>
                </label>
                <div className="payment-options-grid">
                  <label className={`payment-option ${formData.paymentMethod === "Card" ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Card"
                      checked={formData.paymentMethod === "Card"}
                      onChange={handleInputChange}
                    />
                    <CreditCard size={18} />
                    <span>Credit / Debit Card</span>
                  </label>

                  <label className={`payment-option ${formData.paymentMethod === "Cash" ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash"
                      checked={formData.paymentMethod === "Cash"}
                      onChange={handleInputChange}
                    />
                    <Banknote size={18} />
                    <span>Cash on Delivery</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary btn-block place-order-btn"
                disabled={isSubmitting}
                id="place-order-button"
              >
                {isSubmitting ? (
                  <>
                    <div className="btn-spinner"></div>
                    <span>Transmitting Order to Kitchen...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    <span>Place Order • ${cartTotal.toFixed(2)}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <p className="checkout-guarantee-note">
                <ShieldCheck size={14} />
                <span>Orders are sent directly to the partner kitchen via REST API</span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

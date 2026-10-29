import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getOrders } from "../services/api";
import {
  Clock,
  Search,
  CheckCircle2,
  Package,
  Bike,
  Home,
  XCircle,
  RefreshCw,
  ShoppingBag,
  MapPin,
  Phone,
  User,
  ArrowRight
} from "lucide-react";

export default function OrderTrackingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const urlOrderId = searchParams.get("orderId");

  // Fetch orders from JSON Server
  const loadOrders = async (shouldSelectLatest = false) => {
    try {
      setIsRefreshing(true);
      setErrorMessage("");
      const ordersData = await getOrders();
      // Sort newest first
      const sortedOrders = [...ordersData].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sortedOrders);

      // Determine which order to display
      if (urlOrderId) {
        const matchingOrder = sortedOrders.find(
          (o) => String(o.id) === String(urlOrderId)
        );
        if (matchingOrder) {
          setSelectedOrder(matchingOrder);
        } else if (sortedOrders.length > 0) {
          setSelectedOrder(sortedOrders[0]);
        }
      } else if (shouldSelectLatest && sortedOrders.length > 0) {
        setSelectedOrder(sortedOrders[0]);
      } else if (!selectedOrder && sortedOrders.length > 0) {
        setSelectedOrder(sortedOrders[0]);
      } else if (selectedOrder) {
        // Keep updated state of currently selected order
        const currentUpdated = sortedOrders.find(
          (o) => String(o.id) === String(selectedOrder.id)
        );
        if (currentUpdated) setSelectedOrder(currentUpdated);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
      setErrorMessage("Could not retrieve orders from JSON Server.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders(true);
  }, [urlOrderId]);

  // Handle Search by ID
  const handleSearchOrder = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    const found = orders.find(
      (o) => String(o.id).toLowerCase() === searchInput.trim().toLowerCase()
    );
    if (found) {
      setSelectedOrder(found);
      setSearchParams({ orderId: found.id });
    } else {
      alert(`No order found matching ID #${searchInput.trim()}`);
    }
  };

  const selectOrder = (order) => {
    setSelectedOrder(order);
    setSearchParams({ orderId: order.id });
  };

  // Helper for tracking steps
  const orderSteps = [
    { key: "Placed", label: "Order Placed", icon: CheckCircle2, description: "Received by restaurant" },
    { key: "Preparing", label: "Preparing Food", icon: Package, description: "Master chef is cooking" },
    { key: "Ready", label: "Order Ready", icon: Bike, description: "Packed & awaiting courier" },
    { key: "Delivered", label: "Delivered", icon: Home, description: "Delivered to your doorstep" }
  ];

  const getStepStatus = (stepKey, currentStatus) => {
    if (currentStatus === "Cancelled") return "cancelled";
    const statusOrder = ["Placed", "Preparing", "Ready", "Delivered"];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  return (
    <div className="orders-page">
      <div className="section-container">
        {/* Header Bar */}
        <div className="orders-page-header">
          <div>
            <span className="badge badge-primary">Order Progression Tracker</span>
            <h1 className="page-heading">Live Order Tracking</h1>
            <p className="page-subheading">
              Monitor the live preparation and delivery status of your orders in real-time.
            </p>
          </div>

          <div className="orders-header-actions">
            <button
              type="button"
              className="btn btn-secondary btn-icon"
              onClick={() => loadOrders(false)}
              disabled={isRefreshing}
            >
              <RefreshCw size={15} className={isRefreshing ? "spinner-rotate" : ""} />
              <span>{isRefreshing ? "Refreshing..." : "Refresh Status"}</span>
            </button>
          </div>
        </div>

        {/* Search Order by ID Bar */}
        <form onSubmit={handleSearchOrder} className="order-search-bar">
          <Search size={18} className="search-bar-icon" />
          <input
            type="text"
            placeholder="Track specific order by Order ID (e.g. 1001, 1002)..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="order-search-input"
          />
          <button type="submit" className="btn btn-primary">
            Track Order
          </button>
        </form>

        {isLoading ? (
          <div className="page-loading-wrapper">
            <div className="custom-spinner"></div>
            <p>Fetching active orders from server...</p>
          </div>
        ) : errorMessage ? (
          <div className="error-state-box">
            <h3>Connection Error</h3>
            <p>{errorMessage}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state-box">
            <ShoppingBag size={48} className="empty-icon" />
            <h3>No Orders Found</h3>
            <p>You haven&apos;t placed any orders yet. Start exploring our top menus today!</p>
            <Link to="/" className="btn btn-primary">
              <span>Browse Restaurants</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="orders-dashboard-grid">
            {/* Left: Selected Order Live Tracker */}
            <div className="active-tracker-column">
              {selectedOrder ? (
                <div className="tracker-card">
                  {/* Tracker Header */}
                  <div className="tracker-card-header">
                    <div>
                      <div className="order-id-chip">Order #{selectedOrder.id}</div>
                      <span className="order-timestamp">
                        Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className={`status-badge-lg status-${selectedOrder.orderStatus.toLowerCase()}`}>
                      {selectedOrder.orderStatus}
                    </div>
                  </div>

                  {/* Cancelled Banner if cancelled */}
                  {selectedOrder.orderStatus === "Cancelled" ? (
                    <div className="cancelled-banner">
                      <XCircle size={24} />
                      <div>
                        <h4>This order has been cancelled</h4>
                        <p>If you have any questions, please contact our 24/7 restaurant support.</p>
                      </div>
                    </div>
                  ) : (
                    /* Visual Stepper Tracker */
                    <div className="stepper-wrapper">
                      <div className="stepper-container">
                        {orderSteps.map((step, index) => {
                          const status = getStepStatus(step.key, selectedOrder.orderStatus);
                          const Icon = step.icon;

                          return (
                            <div key={step.key} className={`stepper-step ${status}`}>
                              <div className="step-marker">
                                <div className="step-icon-bubble">
                                  <Icon size={18} />
                                </div>
                                {index < orderSteps.length - 1 && (
                                  <div className="step-connector-line"></div>
                                )}
                              </div>
                              <div className="step-info">
                                <h4 className="step-title">{step.label}</h4>
                                <p className="step-desc">{step.description}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Customer & Delivery Information */}
                  <div className="tracker-details-section">
                    <h3 className="section-minor-heading">Delivery Details</h3>
                    <div className="delivery-details-grid">
                      <div className="detail-item">
                        <User size={16} className="detail-icon" />
                        <div>
                          <span className="detail-label">Recipient</span>
                          <strong>{selectedOrder.customerName}</strong>
                        </div>
                      </div>

                      {selectedOrder.customerPhone && (
                        <div className="detail-item">
                          <Phone size={16} className="detail-icon" />
                          <div>
                            <span className="detail-label">Phone</span>
                            <strong>{selectedOrder.customerPhone}</strong>
                          </div>
                        </div>
                      )}

                      <div className="detail-item full-width">
                        <MapPin size={16} className="detail-icon" />
                        <div>
                          <span className="detail-label">Delivery Address</span>
                          <strong>{selectedOrder.deliveryAddress}</strong>
                        </div>
                      </div>

                      {selectedOrder.deliveryNotes && (
                        <div className="detail-item full-width note-item">
                          <span className="detail-label">Special Notes:</span>
                          <em>&quot;{selectedOrder.deliveryNotes}&quot;</em>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ordered Items List */}
                  <div className="tracker-items-section">
                    <h3 className="section-minor-heading">Items Summary</h3>
                    <div className="order-items-table">
                      {selectedOrder.items?.map((item, idx) => (
                        <div key={idx} className="order-item-line">
                          <div className="item-qty-name">
                            <span className="item-qty-tag">{item.quantity}x</span>
                            <div>
                              <strong className="item-name">{item.name}</strong>
                              {item.restaurantName && (
                                <span className="item-kitchen">{item.restaurantName}</span>
                              )}
                            </div>
                          </div>
                          <span className="item-price">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="order-total-bar">
                      <span>Total Paid</span>
                      <span className="order-total-amount">
                        ${Number(selectedOrder.totalAmount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="empty-state-box">
                  <p>Select an order from the list on the right to view its progress.</p>
                </div>
              )}
            </div>

            {/* Right: Orders History List */}
            <div className="orders-sidebar-column">
              <div className="sidebar-card">
                <div className="sidebar-header">
                  <h3>All Orders ({orders.length})</h3>
                  <span className="sidebar-hint">Click to track</span>
                </div>

                <div className="orders-scroll-list">
                  {orders.map((order) => {
                    const isSelected = selectedOrder && String(selectedOrder.id) === String(order.id);

                    return (
                      <div
                        key={order.id}
                        className={`order-list-item ${isSelected ? "selected" : ""}`}
                        onClick={() => selectOrder(order)}
                      >
                        <div className="order-list-row-1">
                          <span className="order-number">#{order.id}</span>
                          <span className={`status-pill status-${order.orderStatus.toLowerCase()}`}>
                            {order.orderStatus}
                          </span>
                        </div>

                        <div className="order-list-row-2">
                          <span className="order-customer-name">{order.customerName}</span>
                          <span className="order-items-count">
                            {order.items?.length || 0} item{(order.items?.length || 0) > 1 ? "s" : ""}
                          </span>
                        </div>

                        <div className="order-list-row-3">
                          <span className="order-date-text">
                            {new Date(order.createdAt).toLocaleDateString([], {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>
                          <span className="order-price-bold">
                            ${Number(order.totalAmount).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getFoods,
  addFood,
  updateFood,
  deleteFood,
  getOrders,
  updateOrder,
  deleteOrder,
  getRestaurants,
  addRestaurant,
  updateRestaurant,
  deleteRestaurant
} from "../services/api";
import { useToast } from "../context/ToastContext";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";
import {
  LayoutDashboard,
  Utensils,
  ShoppingBag,
  Store,
  Plus,
  Edit2,
  Trash2,
  Search,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Filter,
  RefreshCw,
  Eye,
  AlertCircle
} from "lucide-react";

export default function AdminPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "overview";

  const { showToast } = useToast();

  // Core Data States
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter States
  const [foodSearch, setFoodSearch] = useState("");
  const [foodCategoryFilter, setFoodCategoryFilter] = useState("All");
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");

  // Food Form Modal State
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [foodFormData, setFoodFormData] = useState({
    name: "",
    restaurantId: "1",
    category: "Pizza",
    price: "",
    description: "",
    image: "",
    available: true
  });
  const [foodFormErrors, setFoodFormErrors] = useState({});

  // Restaurant Form Modal State
  const [isRestaurantModalOpen, setIsRestaurantModalOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [restaurantFormData, setRestaurantFormData] = useState({
    name: "",
    location: "",
    description: "",
    image: "",
    rating: 4.8,
    cuisineType: "",
    deliveryTime: "25-35 mins"
  });

  // Confirm Delete Modal State
  const [deleteConfirmState, setDeleteConfirmState] = useState({
    isOpen: false,
    type: null, // "food" | "order" | "restaurant"
    id: null,
    title: "",
    message: ""
  });
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Order Details Modal
  const [viewingOrder, setViewingOrder] = useState(null);

  // Load All Data from JSON Server
  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      const [foodsData, ordersData, restaurantsData] = await Promise.all([
        getFoods(),
        getOrders(),
        getRestaurants()
      ]);
      setFoods(foodsData);
      setOrders(ordersData);
      setRestaurants(restaurantsData);
    } catch (err) {
      console.error("Admin data fetch error:", err);
      showToast("Failed to fetch administrative data from server.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const setTab = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  // ==========================================
  // DASHBOARD CALCULATIONS
  // ==========================================
  const totalRevenue = orders.reduce((sum, order) => {
    // Only count non-cancelled orders towards revenue
    return order.orderStatus !== "Cancelled" ? sum + Number(order.totalAmount || 0) : sum;
  }, 0);

  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(
    (o) => o.orderStatus === "Placed" || o.orderStatus === "Preparing"
  ).length;
  const deliveredOrdersCount = orders.filter((o) => o.orderStatus === "Delivered").length;
  const activeFoodsCount = foods.filter((f) => f.available).length;
  const averageOrderValue =
    totalOrdersCount > 0 ? (totalRevenue / (totalOrdersCount - orders.filter(o => o.orderStatus === "Cancelled").length || 1)).toFixed(2) : "0.00";

  // ==========================================
  // FOOD CRUD HANDLERS
  // ==========================================
  const handleOpenAddFood = () => {
    setEditingFood(null);
    setFoodFormData({
      name: "",
      restaurantId: restaurants.length > 0 ? String(restaurants[0].id) : "1",
      category: "Pizza",
      price: "",
      description: "",
      image: "",
      available: true
    });
    setFoodFormErrors({});
    setIsFoodModalOpen(true);
  };

  const handleOpenEditFood = (food) => {
    setEditingFood(food);
    setFoodFormData({
      name: food.name,
      restaurantId: String(food.restaurantId),
      category: food.category,
      price: String(food.price),
      description: food.description,
      image: food.image,
      available: food.available
    });
    setFoodFormErrors({});
    setIsFoodModalOpen(true);
  };

  const validateFoodForm = () => {
    const errors = {};
    if (!foodFormData.name.trim()) errors.name = "Dish name is required";
    if (!foodFormData.price || isNaN(foodFormData.price) || Number(foodFormData.price) <= 0) {
      errors.price = "Enter a valid positive price";
    }
    if (!foodFormData.category.trim()) errors.category = "Category is required";
    if (!foodFormData.description.trim()) errors.description = "Description is required";
    setFoodFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveFood = async (e) => {
    e.preventDefault();
    if (!validateFoodForm()) return;

    try {
      setIsActionLoading(true);
      const payload = {
        name: foodFormData.name.trim(),
        restaurantId: String(foodFormData.restaurantId),
        category: foodFormData.category.trim(),
        price: Number(foodFormData.price),
        description: foodFormData.description.trim(),
        image:
          foodFormData.image.trim() ||
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
        available: Boolean(foodFormData.available)
      };

      if (editingFood) {
        // PUT request
        const updated = await updateFood(editingFood.id, payload);
        setFoods((prev) =>
          prev.map((item) => (String(item.id) === String(editingFood.id) ? updated : item))
        );
        showToast(`Updated "${updated.name}" successfully!`, "success");
      } else {
        // POST request
        const created = await addFood(payload);
        setFoods((prev) => [created, ...prev]);
        showToast(`Added "${created.name}" to menu!`, "success");
      }
      setIsFoodModalOpen(false);
    } catch (err) {
      console.error("Save food failed:", err);
      showToast("Error saving food item to server.", "error");
    } finally {
      setIsActionLoading(false);
    }
  };

  // Toggle food availability (PUT request)
  const handleToggleAvailability = async (food) => {
    try {
      const updatedAvailability = !food.available;
      const updatedItem = await updateFood(food.id, {
        ...food,
        available: updatedAvailability
      });

      setFoods((prev) =>
        prev.map((item) => (String(item.id) === String(food.id) ? updatedItem : item))
      );

      showToast(
        `"${food.name}" is now marked as ${updatedAvailability ? "Available" : "Sold Out"}.`,
        "info"
      );
    } catch (err) {
      console.error("Availability toggle error:", err);
      showToast("Failed to update availability status on server.", "error");
    }
  };

  // ==========================================
  // ORDER STATUS UPDATE (PUT REQUEST)
  // ==========================================
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderToUpdate = orders.find((o) => String(o.id) === String(orderId));
      if (!orderToUpdate) return;

      const updated = await updateOrder(orderId, {
        ...orderToUpdate,
        orderStatus: newStatus
      });

      setOrders((prev) =>
        prev.map((o) => (String(o.id) === String(orderId) ? updated : o))
      );

      if (viewingOrder && String(viewingOrder.id) === String(orderId)) {
        setViewingOrder(updated);
      }

      showToast(`Order #${orderId} status changed to "${newStatus}"`, "success");
    } catch (err) {
      console.error("Order status update failed:", err);
      showToast("Failed to update order status.", "error");
    }
  };

  // ==========================================
  // RESTAURANT CRUD HANDLERS
  // ==========================================
  const handleOpenAddRestaurant = () => {
    setEditingRestaurant(null);
    setRestaurantFormData({
      name: "",
      location: "",
      description: "",
      image: "",
      rating: 4.8,
      cuisineType: "",
      deliveryTime: "25-35 mins"
    });
    setIsRestaurantModalOpen(true);
  };

  const handleOpenEditRestaurant = (restaurant) => {
    setEditingRestaurant(restaurant);
    setRestaurantFormData({
      name: restaurant.name,
      location: restaurant.location,
      description: restaurant.description,
      image: restaurant.image,
      rating: restaurant.rating || 4.8,
      cuisineType: restaurant.cuisineType || "",
      deliveryTime: restaurant.deliveryTime || "25-35 mins"
    });
    setIsRestaurantModalOpen(true);
  };

  const handleSaveRestaurant = async (e) => {
    e.preventDefault();
    if (!restaurantFormData.name.trim() || !restaurantFormData.location.trim()) {
      showToast("Please provide restaurant name and location.", "error");
      return;
    }

    try {
      setIsActionLoading(true);
      const payload = {
        name: restaurantFormData.name.trim(),
        location: restaurantFormData.location.trim(),
        description: restaurantFormData.description.trim(),
        image:
          restaurantFormData.image.trim() ||
          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
        rating: Number(restaurantFormData.rating),
        cuisineType: restaurantFormData.cuisineType.trim() || "Gourmet",
        deliveryTime: restaurantFormData.deliveryTime.trim() || "30-40 mins"
      };

      if (editingRestaurant) {
        const updated = await updateRestaurant(editingRestaurant.id, payload);
        setRestaurants((prev) =>
          prev.map((r) => (String(r.id) === String(editingRestaurant.id) ? updated : r))
        );
        showToast(`Updated restaurant "${updated.name}"!`, "success");
      } else {
        const created = await addRestaurant(payload);
        setRestaurants((prev) => [...prev, created]);
        showToast(`Added restaurant "${created.name}"!`, "success");
      }
      setIsRestaurantModalOpen(false);
    } catch (err) {
      console.error("Save restaurant failed:", err);
      showToast("Failed to save restaurant details.", "error");
    } finally {
      setIsActionLoading(false);
    }
  };

  // ==========================================
  // CONFIRM DELETION (DELETE REQUEST)
  // ==========================================
  const requestDelete = (type, id, itemName) => {
    setDeleteConfirmState({
      isOpen: true,
      type,
      id,
      title: `Delete ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      message: `Are you sure you want to permanently delete "${itemName}"? This will send a DELETE request to JSON Server.`
    });
  };

  const handleConfirmDelete = async () => {
    const { type, id } = deleteConfirmState;
    if (!type || !id) return;

    try {
      setIsActionLoading(true);

      if (type === "food") {
        await deleteFood(id);
        setFoods((prev) => prev.filter((f) => String(f.id) !== String(id)));
        showToast("Food item deleted from menu.", "success");
      } else if (type === "order") {
        await deleteOrder(id);
        setOrders((prev) => prev.filter((o) => String(o.id) !== String(id)));
        if (viewingOrder && String(viewingOrder.id) === String(id)) {
          setViewingOrder(null);
        }
        showToast(`Order #${id} deleted.`, "success");
      } else if (type === "restaurant") {
        await deleteRestaurant(id);
        setRestaurants((prev) => prev.filter((r) => String(r.id) !== String(id)));
        showToast("Restaurant partner deleted.", "success");
      }

      setDeleteConfirmState({ isOpen: false, type: null, id: null, title: "", message: "" });
    } catch (err) {
      console.error("Delete operation failed:", err);
      showToast(`Failed to delete ${type}.`, "error");
    } finally {
      setIsActionLoading(false);
    }
  };

  // Filtered food list
  const filteredFoods = foods.filter((food) => {
    const matchesSearch =
      food.name.toLowerCase().includes(foodSearch.toLowerCase().trim()) ||
      food.category.toLowerCase().includes(foodSearch.toLowerCase().trim());
    const matchesCategory =
      foodCategoryFilter === "All" || food.category === foodCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filtered orders list
  const filteredOrders = orders.filter((order) => {
    if (orderStatusFilter === "All") return true;
    return order.orderStatus === orderStatusFilter;
  });

  const foodCategories = ["All", ...new Set(foods.map((f) => f.category).filter(Boolean))];

  return (
    <div className="admin-page">
      <div className="section-container">
        {/* Admin Header */}
        <div className="admin-header-row">
          <div>
            <div className="admin-chip">Administrator Portal</div>
            <h1 className="admin-title">Restaurant Management System</h1>
            <p className="admin-subtext">
              Real-time menu management, availability toggles, incoming orders, and operational metrics connected directly to JSON Server REST endpoints.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-icon"
            onClick={fetchAllData}
            disabled={isLoading}
          >
            <RefreshCw size={15} className={isLoading ? "spinner-rotate" : ""} />
            <span>Sync Data</span>
          </button>
        </div>

        {/* Tab Navigation Navigation */}
        <div className="admin-tabs-nav">
          <button
            type="button"
            className={`admin-tab-btn ${currentTab === "overview" ? "active" : ""}`}
            onClick={() => setTab("overview")}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard Overview</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${currentTab === "foods" ? "active" : ""}`}
            onClick={() => setTab("foods")}
          >
            <Utensils size={18} />
            <span>Menu Items ({foods.length})</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${currentTab === "orders" ? "active" : ""}`}
            onClick={() => setTab("orders")}
          >
            <ShoppingBag size={18} />
            <span>Orders Management ({orders.length})</span>
            {pendingOrdersCount > 0 && (
              <span className="tab-counter-badge">{pendingOrdersCount}</span>
            )}
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${currentTab === "restaurants" ? "active" : ""}`}
            onClick={() => setTab("restaurants")}
          >
            <Store size={18} />
            <span>Restaurants ({restaurants.length})</span>
          </button>
        </div>

        {isLoading ? (
          <div className="page-loading-wrapper">
            <div className="custom-spinner"></div>
            <p>Synchronizing data with JSON Server...</p>
          </div>
        ) : (
          <>
            {/* ========================================================= */}
            {/* TAB 1: DASHBOARD OVERVIEW */}
            {/* ========================================================= */}
            {currentTab === "overview" && (
              <div className="admin-tab-content">
                {/* Stats Cards Grid */}
                <div className="admin-stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon-wrapper revenue">
                      <DollarSign size={24} />
                    </div>
                    <div className="stat-info">
                      <span className="stat-label">Total Revenue</span>
                      <h3 className="stat-value">${totalRevenue.toFixed(2)}</h3>
                      <span className="stat-sub">From fulfilled orders</span>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon-wrapper orders">
                      <ShoppingBag size={24} />
                    </div>
                    <div className="stat-info">
                      <span className="stat-label">Total Orders</span>
                      <h3 className="stat-value">{totalOrdersCount}</h3>
                      <span className="stat-sub">{pendingOrdersCount} currently active</span>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon-wrapper pending">
                      <Clock size={24} />
                    </div>
                    <div className="stat-info">
                      <span className="stat-label">Pending Orders</span>
                      <h3 className="stat-value">{pendingOrdersCount}</h3>
                      <span className="stat-sub">Placed & Preparing</span>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon-wrapper delivered">
                      <CheckCircle2 size={24} />
                    </div>
                    <div className="stat-info">
                      <span className="stat-label">Delivered Orders</span>
                      <h3 className="stat-value">{deliveredOrdersCount}</h3>
                      <span className="stat-sub">Successfully fulfilled</span>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon-wrapper menu">
                      <Utensils size={24} />
                    </div>
                    <div className="stat-info">
                      <span className="stat-label">Food Items</span>
                      <h3 className="stat-value">{foods.length}</h3>
                      <span className="stat-sub">{activeFoodsCount} in stock</span>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon-wrapper avg">
                      <TrendingUp size={24} />
                    </div>
                    <div className="stat-info">
                      <span className="stat-label">Avg Order Value</span>
                      <h3 className="stat-value">${averageOrderValue}</h3>
                      <span className="stat-sub">Per transaction</span>
                    </div>
                  </div>
                </div>

                {/* Quick Shortcuts & Recent Orders Activity */}
                <div className="admin-overview-columns">
                  <div className="overview-card">
                    <div className="card-header-bar">
                      <h3>Recent Order Activity</h3>
                      <button
                        type="button"
                        className="btn-text-link"
                        onClick={() => setTab("orders")}
                      >
                        View All Orders
                      </button>
                    </div>

                    <div className="overview-orders-list">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="overview-order-item">
                          <div>
                            <strong>Order #{order.id}</strong>
                            <p className="overview-order-customer">
                              {order.customerName} • {order.items?.length || 0} items
                            </p>
                          </div>
                          <div className="overview-order-meta">
                            <span className={`status-pill status-${order.orderStatus.toLowerCase()}`}>
                              {order.orderStatus}
                            </span>
                            <span className="overview-order-price">
                              ${Number(order.totalAmount).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="overview-card">
                    <div className="card-header-bar">
                      <h3>Quick Admin Actions</h3>
                    </div>

                    <div className="quick-actions-list">
                      <button
                        type="button"
                        className="quick-action-btn"
                        onClick={handleOpenAddFood}
                      >
                        <Plus size={18} />
                        <div>
                          <strong>Add New Food Dish</strong>
                          <span>Create a new menu item for any restaurant</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        className="quick-action-btn"
                        onClick={() => setTab("foods")}
                      >
                        <ToggleRight size={18} />
                        <div>
                          <strong>Toggle Food Availability</strong>
                          <span>Turn dishes on/off stock with 1 click</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        className="quick-action-btn"
                        onClick={handleOpenAddRestaurant}
                      >
                        <Store size={18} />
                        <div>
                          <strong>Register Partner Restaurant</strong>
                          <span>Add new culinary kitchen partner</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 2: MENU ITEMS MANAGEMENT (CRUD + AVAILABILITY) */}
            {/* ========================================================= */}
            {currentTab === "foods" && (
              <div className="admin-tab-content">
                {/* Food Toolbar */}
                <div className="admin-toolbar">
                  <div className="toolbar-search-wrapper">
                    <Search size={18} className="toolbar-search-icon" />
                    <input
                      type="text"
                      placeholder="Search food by name or category..."
                      value={foodSearch}
                      onChange={(e) => setFoodSearch(e.target.value)}
                      className="toolbar-search-input"
                    />
                  </div>

                  <div className="toolbar-filter-select-wrapper">
                    <Filter size={15} />
                    <select
                      value={foodCategoryFilter}
                      onChange={(e) => setFoodCategoryFilter(e.target.value)}
                      className="toolbar-select"
                    >
                      {foodCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleOpenAddFood}
                    id="add-food-btn"
                  >
                    <Plus size={16} />
                    <span>Add New Food</span>
                  </button>
                </div>

                {/* Foods Table */}
                <div className="admin-table-container">
                  <table className="admin-data-table">
                    <thead>
                      <tr>
                        <th>Dish</th>
                        <th>Category</th>
                        <th>Restaurant</th>
                        <th>Price</th>
                        <th>Availability</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFoods.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="table-empty-cell">
                            No food items found matching your filters.
                          </td>
                        </tr>
                      ) : (
                        filteredFoods.map((food) => {
                          const restaurant = restaurants.find(
                            (r) => String(r.id) === String(food.restaurantId)
                          );

                          return (
                            <tr key={food.id}>
                              <td>
                                <div className="table-dish-cell">
                                  <img
                                    src={food.image}
                                    alt={food.name}
                                    className="table-dish-thumbnail"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";
                                    }}
                                  />
                                  <div>
                                    <strong className="dish-name-cell">{food.name}</strong>
                                    <p className="dish-desc-cell">{food.description}</p>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className="badge badge-category">{food.category}</span>
                              </td>
                              <td>{restaurant ? restaurant.name : "N/A"}</td>
                              <td>
                                <strong className="table-price">
                                  ${Number(food.price).toFixed(2)}
                                </strong>
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className={`availability-toggle-btn ${food.available ? "in-stock" : "out-of-stock"}`}
                                  onClick={() => handleToggleAvailability(food)}
                                  title="Click to toggle availability"
                                >
                                  {food.available ? (
                                    <>
                                      <ToggleRight size={22} className="toggle-icon-active" />
                                      <span>Available</span>
                                    </>
                                  ) : (
                                    <>
                                      <ToggleLeft size={22} className="toggle-icon-inactive" />
                                      <span>Sold Out</span>
                                    </>
                                  )}
                                </button>
                              </td>
                              <td className="text-right">
                                <div className="table-actions-group">
                                  <button
                                    type="button"
                                    className="action-icon-btn action-edit"
                                    onClick={() => handleOpenEditFood(food)}
                                    title="Edit food details"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button
                                    type="button"
                                    className="action-icon-btn action-delete"
                                    onClick={() => requestDelete("food", food.id, food.name)}
                                    title="Delete food item"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 3: ORDERS MANAGEMENT */}
            {/* ========================================================= */}
            {currentTab === "orders" && (
              <div className="admin-tab-content">
                {/* Orders Toolbar */}
                <div className="admin-toolbar">
                  <div className="orders-filter-chips">
                    {["All", "Placed", "Preparing", "Ready", "Delivered", "Cancelled"].map(
                      (status) => (
                        <button
                          key={status}
                          type="button"
                          className={`filter-chip ${orderStatusFilter === status ? "active" : ""}`}
                          onClick={() => setOrderStatusFilter(status)}
                        >
                          {status}
                          {status !== "All" && (
                            <span className="chip-count">
                              ({orders.filter((o) => o.orderStatus === status).length})
                            </span>
                          )}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Orders Table */}
                <div className="admin-table-container">
                  <table className="admin-data-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Order Status</th>
                        <th>Date & Time</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="table-empty-cell">
                            No orders found with status &quot;{orderStatusFilter}&quot;.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => (
                          <tr key={order.id}>
                            <td>
                              <span className="order-id-badge">#{order.id}</span>
                            </td>
                            <td>
                              <div>
                                <strong>{order.customerName}</strong>
                                {order.customerPhone && (
                                  <p className="table-sub-text">{order.customerPhone}</p>
                                )}
                              </div>
                            </td>
                            <td>
                              <span className="table-items-summary">
                                {order.items?.map((item) => `${item.quantity}x ${item.name}`).join(", ")}
                              </span>
                            </td>
                            <td>
                              <strong className="table-price">
                                ${Number(order.totalAmount).toFixed(2)}
                              </strong>
                            </td>
                            <td>
                              {/* Status Selector Dropdown */}
                              <select
                                className={`table-status-select status-${order.orderStatus.toLowerCase()}`}
                                value={order.orderStatus}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              >
                                <option value="Placed">Placed</option>
                                <option value="Preparing">Preparing</option>
                                <option value="Ready">Ready</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td>
                              <span className="table-date">
                                {new Date(order.createdAt).toLocaleString([], {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}
                              </span>
                            </td>
                            <td className="text-right">
                              <div className="table-actions-group">
                                <button
                                  type="button"
                                  className="action-icon-btn action-view"
                                  onClick={() => setViewingOrder(order)}
                                  title="View order details"
                                >
                                  <Eye size={16} />
                                </button>
                                <button
                                  type="button"
                                  className="action-icon-btn action-delete"
                                  onClick={() =>
                                    requestDelete("order", order.id, `Order #${order.id}`)
                                  }
                                  title="Delete order"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 4: RESTAURANTS MANAGEMENT */}
            {/* ========================================================= */}
            {currentTab === "restaurants" && (
              <div className="admin-tab-content">
                <div className="admin-toolbar">
                  <div>
                    <h3>Partner Restaurants Directory</h3>
                    <p className="admin-subtext">Manage partner establishments and delivery details</p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleOpenAddRestaurant}
                    id="add-restaurant-btn"
                  >
                    <Plus size={16} />
                    <span>Add Restaurant</span>
                  </button>
                </div>

                <div className="restaurants-admin-grid">
                  {restaurants.map((restaurant) => (
                    <div key={restaurant.id} className="restaurant-admin-card">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="restaurant-admin-thumb"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80";
                        }}
                      />
                      <div className="restaurant-admin-body">
                        <div className="restaurant-admin-header">
                          <h4>{restaurant.name}</h4>
                          <span className="badge badge-cuisine">{restaurant.cuisineType}</span>
                        </div>
                        <p className="restaurant-admin-desc">{restaurant.description}</p>
                        <p className="restaurant-admin-loc">
                          <strong>Location:</strong> {restaurant.location}
                        </p>
                        <div className="restaurant-admin-footer">
                          <span>{restaurant.deliveryTime}</span>
                          <div className="table-actions-group">
                            <button
                              type="button"
                              className="action-icon-btn action-edit"
                              onClick={() => handleOpenEditRestaurant(restaurant)}
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              type="button"
                              className="action-icon-btn action-delete"
                              onClick={() =>
                                requestDelete("restaurant", restaurant.id, restaurant.name)
                              }
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ========================================================= */}
        {/* MODAL: ADD / EDIT FOOD */}
        {/* ========================================================= */}
        <Modal
          isOpen={isFoodModalOpen}
          onClose={() => setIsFoodModalOpen(false)}
          title={editingFood ? "Edit Food Item" : "Add New Food Item"}
          maxWidth="560px"
        >
          <form onSubmit={handleSaveFood} className="admin-modal-form">
            <div className="form-field">
              <label className="form-label">Dish Name *</label>
              <input
                type="text"
                className={`form-input ${foodFormErrors.name ? "input-error" : ""}`}
                placeholder="e.g. Truffle Mushroom Pizza"
                value={foodFormData.name}
                onChange={(e) => setFoodFormData({ ...foodFormData, name: e.target.value })}
              />
              {foodFormErrors.name && (
                <span className="field-error-message">{foodFormErrors.name}</span>
              )}
            </div>

            <div className="form-grid-2">
              <div className="form-field">
                <label className="form-label">Restaurant *</label>
                <select
                  className="form-select"
                  value={foodFormData.restaurantId}
                  onChange={(e) =>
                    setFoodFormData({ ...foodFormData, restaurantId: e.target.value })
                  }
                >
                  {restaurants.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="form-label">Category *</label>
                <input
                  type="text"
                  className={`form-input ${foodFormErrors.category ? "input-error" : ""}`}
                  placeholder="e.g. Pizza, Pasta, Curry, Burger"
                  value={foodFormData.category}
                  onChange={(e) =>
                    setFoodFormData({ ...foodFormData, category: e.target.value })
                  }
                />
                {foodFormErrors.category && (
                  <span className="field-error-message">{foodFormErrors.category}</span>
                )}
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-field">
                <label className="form-label">Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className={`form-input ${foodFormErrors.price ? "input-error" : ""}`}
                  placeholder="e.g. 14.99"
                  value={foodFormData.price}
                  onChange={(e) => setFoodFormData({ ...foodFormData, price: e.target.value })}
                />
                {foodFormErrors.price && (
                  <span className="field-error-message">{foodFormErrors.price}</span>
                )}
              </div>

              <div className="form-field">
                <label className="form-label">Initial Availability</label>
                <select
                  className="form-select"
                  value={foodFormData.available ? "true" : "false"}
                  onChange={(e) =>
                    setFoodFormData({ ...foodFormData, available: e.target.value === "true" })
                  }
                >
                  <option value="true">In Stock / Available</option>
                  <option value="false">Sold Out / Unavailable</option>
                </select>
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Image URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://images.unsplash.com/..."
                value={foodFormData.image}
                onChange={(e) => setFoodFormData({ ...foodFormData, image: e.target.value })}
              />
              <span className="field-hint">
                Leave blank to automatically use a delicious default dish image.
              </span>
            </div>

            <div className="form-field">
              <label className="form-label">Description *</label>
              <textarea
                rows="3"
                className={`form-textarea ${foodFormErrors.description ? "input-error" : ""}`}
                placeholder="Describe key ingredients, preparation style, and flavors..."
                value={foodFormData.description}
                onChange={(e) =>
                  setFoodFormData({ ...foodFormData, description: e.target.value })
                }
              ></textarea>
              {foodFormErrors.description && (
                <span className="field-error-message">{foodFormErrors.description}</span>
              )}
            </div>

            <div className="modal-actions-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsFoodModalOpen(false)}
                disabled={isActionLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isActionLoading}
                id="save-food-submit-btn"
              >
                {isActionLoading ? "Saving via API..." : editingFood ? "Update Food" : "Add Food Item"}
              </button>
            </div>
          </form>
        </Modal>

        {/* ========================================================= */}
        {/* MODAL: ADD / EDIT RESTAURANT */}
        {/* ========================================================= */}
        <Modal
          isOpen={isRestaurantModalOpen}
          onClose={() => setIsRestaurantModalOpen(false)}
          title={editingRestaurant ? "Edit Restaurant Partner" : "Register Partner Restaurant"}
          maxWidth="560px"
        >
          <form onSubmit={handleSaveRestaurant} className="admin-modal-form">
            <div className="form-field">
              <label className="form-label">Restaurant Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Bella Italia Bistro"
                value={restaurantFormData.name}
                onChange={(e) =>
                  setRestaurantFormData({ ...restaurantFormData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="form-grid-2">
              <div className="form-field">
                <label className="form-label">Cuisine Category *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Italian, Sushi, Indian"
                  value={restaurantFormData.cuisineType}
                  onChange={(e) =>
                    setRestaurantFormData({ ...restaurantFormData, cuisineType: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-field">
                <label className="form-label">Estimated Delivery Time</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 25-35 mins"
                  value={restaurantFormData.deliveryTime}
                  onChange={(e) =>
                    setRestaurantFormData({ ...restaurantFormData, deliveryTime: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Location Address *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 104 Main Street, Downtown"
                value={restaurantFormData.location}
                onChange={(e) =>
                  setRestaurantFormData({ ...restaurantFormData, location: e.target.value })
                }
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">Banner Image URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://images.unsplash.com/..."
                value={restaurantFormData.image}
                onChange={(e) =>
                  setRestaurantFormData({ ...restaurantFormData, image: e.target.value })
                }
              />
            </div>

            <div className="form-field">
              <label className="form-label">Description</label>
              <textarea
                rows="3"
                className="form-textarea"
                placeholder="Short bio or restaurant specialty..."
                value={restaurantFormData.description}
                onChange={(e) =>
                  setRestaurantFormData({ ...restaurantFormData, description: e.target.value })
                }
              ></textarea>
            </div>

            <div className="modal-actions-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsRestaurantModalOpen(false)}
                disabled={isActionLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isActionLoading}
              >
                {isActionLoading ? "Saving..." : editingRestaurant ? "Update Restaurant" : "Create Restaurant"}
              </button>
            </div>
          </form>
        </Modal>

        {/* ========================================================= */}
        {/* MODAL: VIEW ORDER DETAILS */}
        {/* ========================================================= */}
        <Modal
          isOpen={Boolean(viewingOrder)}
          onClose={() => setViewingOrder(null)}
          title={`Order #${viewingOrder?.id} Details`}
          maxWidth="560px"
        >
          {viewingOrder && (
            <div className="order-details-modal">
              <div className="order-details-header">
                <div>
                  <span className="detail-label">Status</span>
                  <select
                    className={`table-status-select status-${viewingOrder.orderStatus.toLowerCase()}`}
                    value={viewingOrder.orderStatus}
                    onChange={(e) => handleUpdateOrderStatus(viewingOrder.id, e.target.value)}
                  >
                    <option value="Placed">Placed</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Ready">Ready</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <span className="detail-label">Placed At</span>
                  <strong>{new Date(viewingOrder.createdAt).toLocaleString()}</strong>
                </div>
              </div>

              <div className="order-modal-customer">
                <h4>Customer Information</h4>
                <p><strong>Name:</strong> {viewingOrder.customerName}</p>
                {viewingOrder.customerPhone && (
                  <p><strong>Phone:</strong> {viewingOrder.customerPhone}</p>
                )}
                <p><strong>Address:</strong> {viewingOrder.deliveryAddress}</p>
                {viewingOrder.deliveryNotes && (
                  <p><strong>Notes:</strong> {viewingOrder.deliveryNotes}</p>
                )}
              </div>

              <div className="order-modal-items">
                <h4>Ordered Items</h4>
                {viewingOrder.items?.map((item, idx) => (
                  <div key={idx} className="order-modal-item-row">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                  </div>
                ))}
                <div className="order-modal-total-row">
                  <span>Total Bill Amount</span>
                  <strong>${Number(viewingOrder.totalAmount).toFixed(2)}</strong>
                </div>
              </div>

              <div className="modal-actions-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setViewingOrder(null)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* ========================================================= */}
        {/* CONFIRM DELETE MODAL */}
        {/* ========================================================= */}
        <ConfirmModal
          isOpen={deleteConfirmState.isOpen}
          onClose={() =>
            setDeleteConfirmState({ isOpen: false, type: null, id: null, title: "", message: "" })
          }
          onConfirm={handleConfirmDelete}
          title={deleteConfirmState.title}
          message={deleteConfirmState.message}
          confirmLabel="Delete Permanently"
          isLoading={isActionLoading}
        />
      </div>
    </div>
  );
}

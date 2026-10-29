import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getRestaurantById, getFoods } from "../services/api";
import FoodCard from "../components/FoodCard";
import { ArrowLeft, MapPin, Clock, Star, Search, Utensils, AlertCircle } from "lucide-react";

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [foodSearchQuery, setFoodSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadRestaurantAndMenu = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const [restaurantData, allFoodsData] = await Promise.all([
          getRestaurantById(id),
          getFoods()
        ]);
        setRestaurant(restaurantData);

        // Filter foods belonging to this restaurant
        const restaurantFoods = allFoodsData.filter(
          (food) => String(food.restaurantId) === String(id)
        );
        setFoods(restaurantFoods);
      } catch (err) {
        console.error("Error loading restaurant details:", err);
        setErrorMessage("Failed to load restaurant details or foods from the API.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadRestaurantAndMenu();
    }
  }, [id]);

  // Extract unique categories for this restaurant
  const categories = ["All", ...new Set(foods.map((food) => food.category).filter(Boolean))];

  // Filter foods by category and search term
  const filteredFoods = foods.filter((food) => {
    const matchesCategory =
      selectedCategory === "All" || food.category === selectedCategory;
    const matchesSearch =
      food.name.toLowerCase().includes(foodSearchQuery.toLowerCase().trim()) ||
      food.description.toLowerCase().includes(foodSearchQuery.toLowerCase().trim());
    return matchesCategory && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="section-container page-loading-wrapper">
        <div className="custom-spinner"></div>
        <p>Loading restaurant menu from JSON Server...</p>
      </div>
    );
  }

  if (errorMessage || !restaurant) {
    return (
      <div className="section-container page-error-wrapper">
        <AlertCircle size={48} className="error-icon" />
        <h2>Restaurant Not Found</h2>
        <p>{errorMessage || "We could not find the requested restaurant in our database."}</p>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Back to Restaurants</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="restaurant-detail-page">
      {/* Restaurant Header Banner */}
      <div className="restaurant-hero-banner">
        <div
          className="restaurant-hero-backdrop"
          style={{ backgroundImage: `url(${restaurant.image})` }}
        ></div>
        <div className="restaurant-hero-overlay"></div>

        <div className="section-container restaurant-hero-container">
          <Link to="/" className="back-link">
            <ArrowLeft size={16} />
            <span>Back to All Restaurants</span>
          </Link>

          <div className="restaurant-hero-card">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="restaurant-hero-avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80";
              }}
            />
            <div className="restaurant-hero-info">
              <div className="restaurant-hero-tags">
                <span className="badge badge-cuisine">{restaurant.cuisineType || "Gourmet"}</span>
                {restaurant.rating && (
                  <span className="badge badge-rating">
                    <Star size={13} fill="currentColor" />
                    <span>{restaurant.rating} Rating</span>
                  </span>
                )}
                {restaurant.deliveryTime && (
                  <span className="badge badge-time">
                    <Clock size={13} />
                    <span>{restaurant.deliveryTime}</span>
                  </span>
                )}
              </div>

              <h1 className="restaurant-hero-title">{restaurant.name}</h1>
              <p className="restaurant-hero-description">{restaurant.description}</p>

              <div className="restaurant-hero-meta">
                <MapPin size={15} />
                <span>{restaurant.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Controls Section */}
      <section className="restaurant-menu-section">
        <div className="section-container">
          {/* Controls Bar: Search & Category Pills */}
          <div className="menu-controls-bar">
            <div className="menu-search-box">
              <Search size={18} className="search-input-icon" />
              <input
                type="text"
                placeholder="Search food in this restaurant..."
                value={foodSearchQuery}
                onChange={(e) => setFoodSearchQuery(e.target.value)}
                className="menu-search-input"
              />
              {foodSearchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setFoodSearchQuery("")}
                >
                  Clear
                </button>
              )}
            </div>

            <div className="category-pills-scroll">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`category-pill ${selectedCategory === category ? "active" : ""}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                  {category === "All"
                    ? ` (${foods.length})`
                    : ` (${foods.filter((f) => f.category === category).length})`}
                </button>
              ))}
            </div>
          </div>

          {/* Food Cards Grid */}
          <div className="menu-content-area">
            <div className="menu-header-row">
              <h2 className="menu-heading">
                {selectedCategory === "All" ? "Full Menu" : `${selectedCategory} Dishes`}
                <span className="menu-count">({filteredFoods.length} items)</span>
              </h2>
            </div>

            {filteredFoods.length === 0 ? (
              <div className="empty-state-box">
                <Utensils size={44} className="empty-icon" />
                <h3>No food items found</h3>
                <p>
                  No dishes match the category &quot;{selectedCategory}&quot; or search query &quot;{foodSearchQuery}&quot;.
                </p>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setSelectedCategory("All");
                    setFoodSearchQuery("");
                  }}
                >
                  Show All Items
                </button>
              </div>
            ) : (
              <div className="foods-grid">
                {filteredFoods.map((food) => (
                  <FoodCard
                    key={food.id}
                    food={food}
                    restaurantName={restaurant.name}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

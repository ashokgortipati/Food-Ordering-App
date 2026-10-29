import { useState, useEffect } from "react";
import { getFoods, getRestaurants } from "../services/api";
import FoodCard from "../components/FoodCard";
import { Search, Filter, UtensilsCrossed, ArrowUpDown, CheckCircle } from "lucide-react";

export default function FoodCatalogPage() {
  const [foods, setFoods] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRestaurant, setSelectedRestaurant] = useState("All");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadCatalogData = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const [foodsData, restaurantsData] = await Promise.all([
          getFoods(),
          getRestaurants()
        ]);
        setFoods(foodsData);
        setRestaurants(restaurantsData);
      } catch (err) {
        console.error("Error loading foods catalog:", err);
        setErrorMessage("Failed to load food items from JSON Server.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCatalogData();
  }, []);

  // Compute categories
  const categories = ["All", ...new Set(foods.map((item) => item.category).filter(Boolean))];

  // Helper to map restaurant ID to name
  const getRestaurantName = (restaurantId) => {
    const restaurant = restaurants.find((r) => String(r.id) === String(restaurantId));
    return restaurant ? restaurant.name : "Partner Kitchen";
  };

  // Filter and sort items
  const filteredFoods = foods
    .filter((food) => {
      const matchesSearch =
        food.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        food.description.toLowerCase().includes(searchQuery.toLowerCase().trim());
      const matchesCategory =
        selectedCategory === "All" || food.category === selectedCategory;
      const matchesRestaurant =
        selectedRestaurant === "All" || String(food.restaurantId) === String(selectedRestaurant);
      const matchesAvailability = !onlyAvailable || food.available === true;

      return matchesSearch && matchesCategory && matchesRestaurant && matchesAvailability;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="catalog-page">
      {/* Header Banner */}
      <section className="catalog-header-banner">
        <div className="section-container">
          <span className="badge badge-primary">Curated Food Catalog</span>
          <h1 className="catalog-title">Explore Gourmet Dishes</h1>
          <p className="catalog-subtitle">
            Search delicious meals across all our partner restaurants. Filter by category, dietary choices, or your favorite kitchens.
          </p>

          {/* Search Bar */}
          <div className="catalog-search-wrapper">
            <Search size={20} className="catalog-search-icon" />
            <input
              type="text"
              placeholder="Search dishes (e.g., Margherita, Biryani, Salmon Roll, Ramen)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="catalog-search-input"
              id="food-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery("")}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Catalog Body */}
      <div className="section-container catalog-body">
        {/* Filters Toolbar */}
        <div className="catalog-filter-toolbar">
          {/* Category Tabs */}
          <div className="category-chips-bar">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`category-chip ${selectedCategory === category ? "active" : ""}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Secondary Controls: Restaurant Filter, Only Available Toggle, Sort */}
          <div className="catalog-secondary-filters">
            <div className="filter-group">
              <label htmlFor="restaurant-select" className="filter-label">
                <Filter size={14} />
                <span>Restaurant:</span>
              </label>
              <select
                id="restaurant-select"
                className="filter-select"
                value={selectedRestaurant}
                onChange={(e) => setSelectedRestaurant(e.target.value)}
              >
                <option value="All">All Restaurants</option>
                {restaurants.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="sort-select" className="filter-label">
                <ArrowUpDown size={14} />
                <span>Sort:</span>
              </label>
              <select
                id="sort-select"
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>

            <label className="available-toggle-label">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="available-checkbox"
              />
              <CheckCircle size={15} className={onlyAvailable ? "active-check" : ""} />
              <span>Available Only</span>
            </label>
          </div>
        </div>

        {/* Results Counter */}
        <div className="catalog-results-info">
          <span>
            Showing <strong>{filteredFoods.length}</strong> food items
          </span>
          {(searchQuery || selectedCategory !== "All" || selectedRestaurant !== "All" || onlyAvailable) && (
            <button
              type="button"
              className="btn-text-link"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedRestaurant("All");
                setOnlyAvailable(false);
                setSortBy("default");
              }}
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Catalog Items Display */}
        {isLoading ? (
          <div className="page-loading-wrapper">
            <div className="custom-spinner"></div>
            <p>Loading dishes from JSON Server...</p>
          </div>
        ) : errorMessage ? (
          <div className="error-state-box">
            <h3>Unable to fetch foods</h3>
            <p>{errorMessage}</p>
          </div>
        ) : filteredFoods.length === 0 ? (
          <div className="empty-state-box">
            <UtensilsCrossed size={48} className="empty-icon" />
            <h3>No matching food items</h3>
            <p>Try clearing filters or search with a different keyword.</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedRestaurant("All");
                setOnlyAvailable(false);
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="foods-grid">
            {filteredFoods.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                restaurantName={getRestaurantName(food.restaurantId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

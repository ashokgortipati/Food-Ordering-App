import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getRestaurants, getFoods } from "../services/api";
import RestaurantCard from "../components/RestaurantCard";
import FoodCard from "../components/FoodCard";
import { Search, UtensilsCrossed, Sparkles, ChefHat, Flame, ArrowRight, ShieldCheck, Clock, Award } from "lucide-react";

export default function HomePage() {
  const [restaurants, setRestaurants] = useState([]);
  const [featuredFoods, setFeaturedFoods] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const [restaurantsData, foodsData] = await Promise.all([
          getRestaurants(),
          getFoods()
        ]);
        setRestaurants(restaurantsData);
        // Take 4 available foods as featured
        const availableDishes = foodsData.filter((item) => item.available);
        setFeaturedFoods(availableDishes.slice(0, 4));
      } catch (err) {
        console.error("Error loading home data:", err);
        setErrorMessage("Could not connect to the API server. Please ensure JSON Server is running on port 3000.");
      } finally {
        setIsLoading(false);
      }
    };

    loadHomeData();
  }, []);

  // Filter restaurants by name or cuisine
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      restaurant.name.toLowerCase().includes(query) ||
      (restaurant.cuisineType && restaurant.cuisineType.toLowerCase().includes(query)) ||
      (restaurant.location && restaurant.location.toLowerCase().includes(query))
    );
  });

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-banner">
        <div className="hero-pattern-overlay"></div>
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={16} className="badge-sparkle" />
              <span>Gourmet Delivery Experience</span>
            </div>
            <h1 className="hero-title">
              Savor Culinary Masterpieces <br />
              <span className="hero-title-gradient">Delivered To Your Door.</span>
            </h1>
            <p className="hero-subtitle">
              Explore hand-picked restaurants, artisanal bakeries, and gourmet bistros. Fresh ingredients, rapid delivery, and seamless real-time tracking.
            </p>

            {/* Quick Hero Search */}
            <div className="hero-search-wrapper">
              <Search size={20} className="hero-search-icon" />
              <input
                type="text"
                className="hero-search-input"
                placeholder="Search by restaurant name, cuisine (Italian, Sushi, Burgers)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="restaurant-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="hero-search-clear"
                  onClick={() => setSearchQuery("")}
                >
                  Clear
                </button>
              )}
            </div>

            <div className="hero-cta-group">
              <a href="#restaurants-section" className="btn btn-primary btn-lg">
                <ChefHat size={18} />
                <span>Explore Restaurants</span>
              </a>
              <Link to="/menu" className="btn btn-outline-light btn-lg">
                <UtensilsCrossed size={18} />
                <span>Browse Full Menu</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Strip */}
      <section className="highlights-bar">
        <div className="highlights-container">
          <div className="highlight-item">
            <div className="highlight-icon-box">
              <Flame size={22} />
            </div>
            <div className="highlight-text">
              <h4>Freshly Prepared</h4>
              <p>Cooked on order by top culinary chefs</p>
            </div>
          </div>
          <div className="highlight-item">
            <div className="highlight-icon-box">
              <Clock size={22} />
            </div>
            <div className="highlight-text">
              <h4>Lightning Fast</h4>
              <p>Average delivery within 30 minutes</p>
            </div>
          </div>
          <div className="highlight-item">
            <div className="highlight-icon-box">
              <Award size={22} />
            </div>
            <div className="highlight-text">
              <h4>Top Rated Spots</h4>
              <p>Strict quality-checked restaurant partners</p>
            </div>
          </div>
          <div className="highlight-item">
            <div className="highlight-icon-box">
              <ShieldCheck size={22} />
            </div>
            <div className="highlight-text">
              <h4>Live Tracking</h4>
              <p>Real-time order progression updates</p>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurants Section */}
      <section id="restaurants-section" className="section-restaurants">
        <div className="section-container">
          <div className="section-header">
            <div>
              <span className="section-subtitle">Partner Kitchens</span>
              <h2 className="section-title">Popular Restaurants</h2>
            </div>
            <Link to="/menu" className="section-link">
              <span>View All Foods</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {isLoading ? (
            <div className="loading-state-wrapper">
              <div className="custom-spinner"></div>
              <p>Connecting to JSON Server & loading restaurants...</p>
            </div>
          ) : errorMessage ? (
            <div className="error-state-box">
              <h3>Connection Notice</h3>
              <p>{errorMessage}</p>
              <button
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                Retry Connection
              </button>
            </div>
          ) : filteredRestaurants.length === 0 ? (
            <div className="empty-state-box">
              <UtensilsCrossed size={48} className="empty-icon" />
              <h3>No restaurants found</h3>
              <p>No restaurants match your search query &quot;{searchQuery}&quot;.</p>
              <button
                className="btn btn-secondary"
                onClick={() => setSearchQuery("")}
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="restaurants-grid">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Food Items */}
      {featuredFoods.length > 0 && (
        <section className="section-featured-foods">
          <div className="section-container">
            <div className="section-header">
              <div>
                <span className="section-subtitle">Chef&apos;s Specials</span>
                <h2 className="section-title">Trending Dishes</h2>
              </div>
              <Link to="/menu" className="section-link">
                <span>Explore Full Catalog</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="foods-grid">
              {featuredFoods.map((food) => {
                const restaurant = restaurants.find(
                  (r) => String(r.id) === String(food.restaurantId)
                );
                return (
                  <FoodCard
                    key={food.id}
                    food={food}
                    restaurantName={restaurant ? restaurant.name : ""}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

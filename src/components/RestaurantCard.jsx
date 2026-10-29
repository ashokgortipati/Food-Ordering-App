import { Link } from "react-router-dom";
import { Star, Clock, MapPin, ArrowRight, Utensils } from "lucide-react";

export default function RestaurantCard({ restaurant }) {
  return (
    <div className="restaurant-card">
      <div className="restaurant-image-wrapper">
        <img
          src={restaurant.image || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"}
          alt={restaurant.name}
          className="restaurant-card-image"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80";
          }}
        />
        <div className="restaurant-floating-badges">
          {restaurant.rating && (
            <div className="restaurant-badge-rating">
              <Star size={14} className="star-icon" fill="currentColor" />
              <span>{restaurant.rating}</span>
            </div>
          )}
          {restaurant.deliveryTime && (
            <div className="restaurant-badge-time">
              <Clock size={13} />
              <span>{restaurant.deliveryTime}</span>
            </div>
          )}
        </div>
      </div>

      <div className="restaurant-card-content">
        <div className="restaurant-header">
          <h3 className="restaurant-name">{restaurant.name}</h3>
          {restaurant.cuisineType && (
            <span className="restaurant-cuisine-tag">{restaurant.cuisineType}</span>
          )}
        </div>

        <p className="restaurant-description">{restaurant.description}</p>

        <div className="restaurant-location">
          <MapPin size={14} className="location-icon" />
          <span>{restaurant.location}</span>
        </div>

        <div className="restaurant-card-footer">
          <Link to={`/restaurant/${restaurant.id}`} className="btn btn-outline-primary explore-menu-btn">
            <Utensils size={15} />
            <span>View Menu</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

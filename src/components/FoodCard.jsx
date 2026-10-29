import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { Plus, Minus, ShoppingBag, Sparkles } from "lucide-react";

export default function FoodCard({ food, restaurantName = "" }) {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const { showToast } = useToast();

  const cartItem = cartItems.find((item) => String(item.foodId) === String(food.id));
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    if (!food.available) return;
    addToCart(food, restaurantName);
    showToast(`Added "${food.name}" to cart!`, "success");
  };

  const handleIncrease = () => {
    addToCart(food, restaurantName);
  };

  const handleDecrease = () => {
    if (quantityInCart > 0) {
      updateQuantity(food.id, quantityInCart - 1);
    }
  };

  return (
    <div className={`food-card ${!food.available ? "food-card-unavailable" : ""}`}>
      <div className="food-image-wrapper">
        <img
          src={food.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"}
          alt={food.name}
          className="food-card-image"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";
          }}
        />
        <div className="food-card-badges">
          <span className="badge badge-category">{food.category}</span>
          {!food.available && (
            <span className="badge badge-out-of-stock">Sold Out</span>
          )}
          {food.available && (
            <span className="badge badge-in-stock">Available</span>
          )}
        </div>
      </div>

      <div className="food-card-content">
        <div className="food-card-header">
          <h3 className="food-card-title">{food.name}</h3>
          <span className="food-card-price">${Number(food.price).toFixed(2)}</span>
        </div>

        {restaurantName && (
          <div className="food-card-restaurant-name">
            <Sparkles size={13} className="sparkle-icon" />
            <span>{restaurantName}</span>
          </div>
        )}

        <p className="food-card-description">{food.description}</p>

        <div className="food-card-footer">
          {food.available ? (
            quantityInCart > 0 ? (
              <div className="cart-counter-controls">
                <button
                  type="button"
                  className="counter-btn"
                  onClick={handleDecrease}
                  aria-label="Decrease quantity"
                >
                  <Minus size={15} />
                </button>
                <span className="counter-value">{quantityInCart}</span>
                <button
                  type="button"
                  className="counter-btn"
                  onClick={handleIncrease}
                  aria-label="Increase quantity"
                >
                  <Plus size={15} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-primary add-to-cart-btn"
                onClick={handleAddToCart}
              >
                <ShoppingBag size={16} />
                <span>Add to Cart</span>
              </button>
            )
          ) : (
            <button type="button" className="btn btn-disabled" disabled>
              Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

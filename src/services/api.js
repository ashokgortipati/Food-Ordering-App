// API Base URL for JSON Server
const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

// ==========================================
// RESTAURANTS API
// ==========================================

export const getRestaurants = async () => {
  const response = await fetch(`${BASE_URL}/restaurants`);
  if (!response.ok) {
    throw new Error("Failed to fetch restaurants");
  }
  return response.json();
};

export const getRestaurantById = async (id) => {
  const response = await fetch(`${BASE_URL}/restaurants/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch restaurant with id: ${id}`);
  }
  return response.json();
};

export const addRestaurant = async (restaurantData) => {
  const response = await fetch(`${BASE_URL}/restaurants`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(restaurantData)
  });
  if (!response.ok) {
    throw new Error("Failed to add restaurant");
  }
  return response.json();
};

export const updateRestaurant = async (id, restaurantData) => {
  const response = await fetch(`${BASE_URL}/restaurants/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(restaurantData)
  });
  if (!response.ok) {
    throw new Error(`Failed to update restaurant with id: ${id}`);
  }
  return response.json();
};

export const deleteRestaurant = async (id) => {
  const response = await fetch(`${BASE_URL}/restaurants/${id}`, {
    method: "DELETE"
  });
  if (!response.ok) {
    throw new Error(`Failed to delete restaurant with id: ${id}`);
  }
  return true;
};

// ==========================================
// FOODS API
// ==========================================

export const getFoods = async () => {
  const response = await fetch(`${BASE_URL}/foods`);
  if (!response.ok) {
    throw new Error("Failed to fetch foods");
  }
  return response.json();
};

export const getFoodById = async (id) => {
  const response = await fetch(`${BASE_URL}/foods/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch food with id: ${id}`);
  }
  return response.json();
};

export const addFood = async (foodData) => {
  const response = await fetch(`${BASE_URL}/foods`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(foodData)
  });
  if (!response.ok) {
    throw new Error("Failed to add food");
  }
  return response.json();
};

export const updateFood = async (id, foodData) => {
  const response = await fetch(`${BASE_URL}/foods/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(foodData)
  });
  if (!response.ok) {
    throw new Error(`Failed to update food with id: ${id}`);
  }
  return response.json();
};

export const deleteFood = async (id) => {
  const response = await fetch(`${BASE_URL}/foods/${id}`, {
    method: "DELETE"
  });
  if (!response.ok) {
    throw new Error(`Failed to delete food with id: ${id}`);
  }
  return true;
};

// ==========================================
// ORDERS API
// ==========================================

export const getOrders = async () => {
  const response = await fetch(`${BASE_URL}/orders`);
  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }
  return response.json();
};

export const getOrderById = async (id) => {
  const response = await fetch(`${BASE_URL}/orders/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch order with id: ${id}`);
  }
  return response.json();
};

export const addOrder = async (orderData) => {
  const response = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(orderData)
  });
  if (!response.ok) {
    throw new Error("Failed to place order");
  }
  return response.json();
};

export const updateOrder = async (id, orderData) => {
  const response = await fetch(`${BASE_URL}/orders/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(orderData)
  });
  if (!response.ok) {
    throw new Error(`Failed to update order with id: ${id}`);
  }
  return response.json();
};

export const deleteOrder = async (id) => {
  const response = await fetch(`${BASE_URL}/orders/${id}`, {
    method: "DELETE"
  });
  if (!response.ok) {
    throw new Error(`Failed to delete order with id: ${id}`);
  }
  return true;
};

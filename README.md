# FeastHub - Food Ordering and Restaurant Portal

A modern, responsive React.js capstone application integrated with a mock REST API via **JSON Server**. FeastHub enables customers to discover partner restaurants, explore culinary menus, search and filter food items, manage a shopping cart, place orders with real-time bill calculations, and track order progression. It also equips restaurant administrators with a full suite of management tools to control food menus, toggle dish availability, update live order statuses, and track business metrics.

---

## 🌟 Key Features

### 🍽️ Customer Portal
- **Restaurant Listing:** Discover premier dining spots with cuisine tags, delivery estimations, ratings, and locations.
- **Menu Exploration:** Explore categorized dishes (Pizzas, Pastas, Curries, Biryanis, Burgers, Sushi, Bowls, Desserts).
- **Search & Filtering:**
  - Real-time search by food name or description.
  - Category pill filter with dynamic item counters.
  - Filter by restaurant partner and in-stock availability.
  - Sort by Price (Low to High, High to Low) and Alphabetical.
- **Shopping Cart & Checkout:**
  - Add/remove items with quantity stepper controls.
  - Real-time calculations: Subtotal, Free Delivery threshold (over $35), 5% Tax, and Total.
  - Checkout form with customer details validation (Name, Phone, Address, Special Instructions).
  - Choice of Payment Method (Card, Cash on Delivery).
- **Live Order Tracking:**
  - Multi-stage visual progression tracker: **Placed ➔ Preparing ➔ Ready ➔ Delivered** (or **Cancelled** alert).
  - Search any order by Order ID.
  - Complete order breakdown including recipient info, items table, and total paid.

### 🛡️ Restaurant Administrator Portal
- **Business KPI Dashboard:**
  - Total Revenue ($ from active orders).
  - Total Orders and Pending Orders counter.
  - Delivered Orders and Average Order Value (AOV).
  - Food inventory statistics (Active Dishes vs Total).
- **Menu Management (CRUD):**
  - **Create (POST):** Add new dishes with name, restaurant, category, price, description, and image URL.
  - **Read (GET):** View all dishes in a structured data table with search and category filters.
  - **Update (PUT):** Edit any dish details or change attributes.
  - **Availability Toggle:** 1-click instant switch between **Available** and **Sold Out** (synchronizes via REST API).
  - **Delete (DELETE):** Remove items with a safe confirmation modal dialog.
- **Order Management:**
  - Filter orders by status (All, Placed, Preparing, Ready, Delivered, Cancelled).
  - Live status dropdown to advance orders through kitchen stages.
  - Inspect order recipient information, delivery notes, and item breakdown.
  - Delete or cancel orders.
- **Restaurant Partners Management:**
  - Register new restaurants, update location/cuisine, or delete partners.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, JavaScript (ES6+), HTML5, CSS3
- **Routing:** React Router v7 (`react-router-dom`)
- **Icons:** Lucide React
- **Mock REST API:** JSON Server (`json-server`)
- **Data Store:** `db.json`
- **State Management:** React Context API (`CartContext`, `ToastContext`), `useState`, `useEffect`
- **Styling:** Custom Design System in Vanilla CSS with tokens, Google Fonts (`Outfit`, `Plus Jakarta Sans`), glassmorphism, responsive grid layouts, and micro-animations.

---

## 🗄️ Database Structure (`db.json`)

The mock database contains three primary collections:

```json
{
  "restaurants": [
    {
      "id": "1",
      "name": "Bella Italia Bistro",
      "location": "Downtown Central, 4th Avenue",
      "description": "Authentic stone-oven pizzas, artisanal pasta, and desserts.",
      "image": "https://images.unsplash.com/...",
      "rating": 4.8,
      "cuisineType": "Italian",
      "deliveryTime": "25-35 mins"
    }
  ],
  "foods": [
    {
      "id": "101",
      "restaurantId": "1",
      "name": "Margherita Con Basilico",
      "category": "Pizza",
      "price": 14.99,
      "description": "San Marzano tomato sauce, fresh buffalo mozzarella, basil.",
      "image": "https://images.unsplash.com/...",
      "available": true
    }
  ],
  "orders": [
    {
      "id": "1001",
      "customerName": "Sophia Taylor",
      "customerPhone": "+1 (555) 234-5678",
      "deliveryAddress": "742 Evergreen Terrace, Apt 4B",
      "items": [
        {
          "foodId": "101",
          "name": "Margherita Con Basilico",
          "price": 14.99,
          "quantity": 2,
          "restaurantName": "Bella Italia Bistro"
        }
      ],
      "totalAmount": 38.48,
      "orderStatus": "Preparing",
      "createdAt": "2026-10-29T16:30:00.000Z"
    }
  ]
}
```

---

## 🚀 Running the Project

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Backend API (JSON Server)
In a terminal, start JSON Server on port 3000:
```bash
npm run server
```
*API Base URL:* `http://localhost:3000`

### 3. Start the Frontend Application (Vite React)
In a second terminal, launch the React development server:
```bash
npm run dev
```
*Frontend URL:* `http://localhost:5173`

*(Optional) Start both simultaneously:*
```bash
npm run dev:all
```

---

## 📡 API Service Layer (`src/services/api.js`)

Centralized REST operations using standard fetch:

| Resource | Method | Function | Endpoint | Description |
|---|---|---|---|---|
| **Restaurants** | GET | `getRestaurants()` | `/restaurants` | Retrieve all restaurants |
| | GET | `getRestaurantById(id)` | `/restaurants/:id` | Get single restaurant |
| | POST | `addRestaurant(data)` | `/restaurants` | Create restaurant |
| | PUT | `updateRestaurant(id, data)` | `/restaurants/:id` | Update restaurant |
| | DELETE | `deleteRestaurant(id)` | `/restaurants/:id` | Delete restaurant |
| **Foods** | GET | `getFoods()` | `/foods` | Retrieve all food items |
| | GET | `getFoodById(id)` | `/foods/:id` | Retrieve single food item |
| | POST | `addFood(data)` | `/foods` | Add new food item |
| | PUT | `updateFood(id, data)` | `/foods/:id` | Update item or availability |
| | DELETE | `deleteFood(id)` | `/foods/:id` | Delete food item |
| **Orders** | GET | `getOrders()` | `/orders` | Retrieve all orders |
| | GET | `getOrderById(id)` | `/orders/:id` | Get single order |
| | POST | `addOrder(data)` | `/orders` | Submit new order |
| | PUT | `updateOrder(id, data)` | `/orders/:id` | Update order / status |
| | DELETE | `deleteOrder(id)` | `/orders/:id` | Delete order record |

---

## 🧭 Page Routes

| Route | Component | Purpose |
|---|---|---|
| `/` | `HomePage` | Hero banner, live search, restaurant cards, trending dishes |
| `/restaurant/:id` | `RestaurantDetailPage` | Restaurant menu, category pills, in-menu search, add to cart |
| `/menu` | `FoodCatalogPage` | Global food catalog with category, restaurant, and availability filters |
| `/cart` | `CartPage` | Shopping cart list, stepper quantity modifiers, bill summary, checkout form |
| `/orders` | `OrderTrackingPage` | Live order progression stepper, order lookup by ID, history list |
| `/admin` | `AdminPage` | KPI dashboard, Food menu CRUD & availability toggle, Order status manager |

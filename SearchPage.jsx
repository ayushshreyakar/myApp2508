import React, { useContext, useState } from "react";
import { StoreContext } from "../context/StoreContext";
import RestaurantCard from "../components/RestaurantCard";
import FoodItem from "../components/FoodItem";
import { useNavigate } from "react-router-dom";
import "./SearchPage.css";

const SearchPage = () => {
  const { restaurants } = useContext(StoreContext);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ restaurants: [], foods: [] });
  const [selectedDish, setSelectedDish] = useState(null); // store selected dish name
  const navigate = useNavigate();

  const allFoods = restaurants
    ? restaurants.flatMap((restaurant) =>
        restaurant.food_list.map((food) => ({
          ...food,
          restaurantId: restaurant._id,
          restaurantName: restaurant.name,
        }))
      )
    : [];

  const handleInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);
    setSelectedDish(null); // reset selected dish when typing again

    if (!value.trim()) {
      setResults({ restaurants: [], foods: [] });
      return;
    }

    const filteredRestaurants = restaurants
      ? restaurants.filter((restaurant) =>
          restaurant.name.toLowerCase().includes(value)
        )
      : [];

    // filter foods and deduplicate by dish name
    const filteredFoods = allFoods.filter((food) =>
      food.name.toLowerCase().includes(value)
    );

    const uniqueFoods = Array.from(
      new Map(filteredFoods.map((food) => [food.name.toLowerCase(), food])).values()
    );

    setResults({
      restaurants: filteredRestaurants,
      foods: uniqueFoods,
    });
  };

  const handleRestaurantClick = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  const handleDishClick = (dishName) => {
    setSelectedDish(dishName);
    setQuery(dishName);
    const dishResults = allFoods.filter(
      (food) => food.name.toLowerCase() === dishName.toLowerCase()
    );
    setResults({ restaurants: [], foods: dishResults });
  };

  return (
    <div className="search-page">
      {/* Search Box */}
      <div className="search-box">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="🔍 Search for restaurants or dishes..."
        />
      </div>

      {/* Auto-suggestions */}
      {query && (results.restaurants.length > 0 || results.foods.length > 0) && !selectedDish && (
        <div className="suggestions">
          <h3>Suggestions</h3>
          <ul>
            {results.restaurants.map((res) => (
              <li
                key={res._id}
                className="suggestion-item"
                onClick={() => handleRestaurantClick(res._id)}
              >
                🍴 {res.name}
              </li>
            ))}
            {results.foods.map((food) => (
              <li
                key={food._id}
                className="suggestion-item"
                onClick={() => handleDishClick(food.name)}
              >
                🥗 {food.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Restaurant results */}
      {results.restaurants.length > 0 && !selectedDish && (
        <div className="results-section">
          <h2>🍴 Restaurants</h2>
          <div className="results-grid">
            {results.restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        </div>
      )}

      {/* Food results */}
      {results.foods.length > 0 && (
        <div className="results-section">
          <h2>
            🥗 {selectedDish ? `Dishes matching "${selectedDish}"` : "Dishes"}
          </h2>
          <div className="results-grid">
            {results.foods.map((food) => (
              <div key={food._id} className="food-card-with-restaurant">
                <FoodItem
                  id={food._id}
                  restaurantId={food.restaurantId}
                  name={food.name}
                  price={food.price}
                  description={food.description}
                  image={food.image}
                />
                <div className="food-extra">
                  <p className="restaurant-label">
                    🍴 From: <strong>{food.restaurantName}</strong>
                  </p>
                  <button
                    className="view-restaurant-btn"
                    onClick={() => handleRestaurantClick(food.restaurantId)}
                  >
                    View Restaurant
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No results */}
      {query &&
        results.restaurants.length === 0 &&
        results.foods.length === 0 &&
        !selectedDish && (
          <p className="no-results">❌ No matches found.</p>
        )}
    </div>
  );
};

export default SearchPage;

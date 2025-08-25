import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import FoodItem from "./FoodItem";
import { StoreContext } from "../context/StoreContext";
import "./FoodDisplay.css";
import { assets } from "../assets/assets";

const FoodDisplay = ({ category }) => {
  const { restaurants, searchQuery } = useContext(StoreContext);
  const navigate = useNavigate();

  // Filter restaurants into two groups
  const matchingRestaurants = restaurants.filter((restaurant) =>
    restaurant.food_list.some(
      (item) =>
        (category === "All" || item.category === category) &&
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const otherRestaurants = restaurants.filter(
    (restaurant) => !matchingRestaurants.includes(restaurant)
  );

  return (
    <div className="food-display">
      <h2 className="food-display-title">Top Dishes Near Me</h2>

      {/* Restaurants that have dishes in this category */}
      {matchingRestaurants.map((restaurant) => (
        <div key={restaurant._id} className="restaurant-section">
          <h3 className="restaurant-name">{restaurant.name}</h3>
          <div className="food-grid">
            {restaurant.food_list
              .filter(
                (item) =>
                  (category === "All" || category === item.category) &&
                  item.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .slice(0, 3)
              .map((item) => (
                <FoodItem
                  key={item._id}
                  id={item._id}
                  restaurantId={restaurant._id}   // ✅ pass restaurant id
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  image={item.image}
                />
              ))}

            {/* View More card inside the grid */}
            <div
              className="food-item view-more-card"
              onClick={() => navigate(`/restaurant/${restaurant._id}`)}
            >
              <img
                src={assets.right_arrow}
                alt="View More"
                className="view-more-img"
              />
              <p className="view-more-text">View More</p>
            </div>
          </div>
        </div>
      ))}

      {/* Other restaurants section */}
      {otherRestaurants.length > 0 && (
        <>
          <h2 className="food-display-title">Other Restaurants</h2>
          {otherRestaurants.map((restaurant) => (
            <div key={restaurant._id} className="restaurant-section">
              <h3 className="restaurant-name">{restaurant.name}</h3>
              <div className="food-grid">
                {restaurant.food_list
                  .filter((item) =>
                    item.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .slice(0, 3)
                  .map((item) => (
                    <FoodItem
                      key={item._id}
                      id={item._id}
                      restaurantId={restaurant._id}   // ✅ pass restaurant id
                      name={item.name}
                      description={item.description}
                      price={item.price}
                      image={item.image}
                    />
                  ))}

                {/* View More card here too */}
                <div
                  className="food-item view-more-card"
                  onClick={() => navigate(`/restaurant/${restaurant._id}`)}
                >
                  <img
                    src={assets.right_arrow}
                    alt="View More"
                    className="view-more-img"
                  />
                  <p className="view-more-text">View More</p>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default FoodDisplay;

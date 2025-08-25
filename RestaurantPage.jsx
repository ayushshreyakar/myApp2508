import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import FoodItem from "../components/FoodItem";
import { StoreContext } from "../context/StoreContext";
import ExploreMenu from "../components/ExploreMenu";
import "./RestaurantPage.css";

const RestaurantPage = () => {
  const { id } = useParams();
  const { restaurants, searchQuery } = useContext(StoreContext);

  const [category, setCategory] = useState("All");

  const restaurant = restaurants.find((r) => r.id === id);

  if (!restaurant) {
    return <h2>Restaurant not found</h2>;
  }

  // Apply category + search filtering
  const filteredItems = restaurant.food_list
    .filter((item) => (category === "All" ? true : item.category === category))
    .filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="restaurant-page">
      {/* Restaurant Name */}
      <h2>{restaurant.name}</h2>

      {/* Explore Menu below restaurant name */}
      <ExploreMenu category={category} setCategory={setCategory} />

      {/* Food Items Grid or No Items Message */}
      {filteredItems.length > 0 ? (
        <div className="food-grid">
          {filteredItems.map((item) => (
            <div className="food-card" key={item._id}>
              <FoodItem
                id={item._id}
                name={item.name}
                restaurantId={restaurant._id}
                description={item.description}
                price={item.price}
                image={item.image}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="no-items">No items found in this category.</p>
      )}
    </div>
  );
};

export default RestaurantPage;

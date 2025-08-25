import React from "react";
import { Link } from "react-router-dom";
import "./RestaurantCard.css";

const RestaurantCard = ({ restaurant }) => {
  return (
    <div className="restaurant-card">
      <Link to={`/restaurant/${restaurant._id}`} className="restaurant-link">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="restaurant-img"
        />
        <div className="restaurant-info">
          <h3>{restaurant.name}</h3>
          <p>{restaurant.category}</p>
          <p>{restaurant.food_list?.length || 0} items</p>
        </div>
      </Link>
    </div>
  );
};

export default RestaurantCard;

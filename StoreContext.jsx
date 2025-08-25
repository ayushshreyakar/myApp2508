import { createContext, useState, useEffect } from "react";
import axios from 'axios'

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

  const url = "http://localhost:4000"
  const[token,setToken] = useState("")
  const[restaurants, setRestaurants] = useState([])

  // ✅ Load cart from localStorage initially
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : {};
  });

  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add to cart
  const addToCart = (restaurantId, itemId) => {
    const key = `${restaurantId}_${itemId}`;
    setCartItems((prev) => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
  };

  // Remove from cart
  const removeFromCart = (restaurantId, itemId) => {
    const key = `${restaurantId}_${itemId}`;
    setCartItems((prev) => {
      if (!prev[key]) return prev;
      const updated = { ...prev, [key]: prev[key] - 1 };
      if (updated[key] <= 0) delete updated[key];
      return updated;
    });
  };

  // ✅ Calculate total using restaurantId + itemId
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    restaurants.forEach((rest) => {
      rest.food_list.forEach((item) => {
        const key = `${rest.id}_${item._id}`;
        if (cartItems[key]) {
          totalAmount += item.price * cartItems[key];
        }
      });
    });
    return totalAmount;
  };

  const fetchRestaurants = async () => {
    const response = await axios.get(url+"/api/food/list")
    setRestaurants(response.data.data)
  }

  useEffect(()=>{
    async function loadData() {
      await fetchRestaurants();
      if (localStorage.getItem("token")){
        setToken(localStorage.getItem("token"));
    }
    }
    loadData()
  },[])

  const contextValue = {
    cartItems,
    addToCart,
    removeFromCart,
    restaurants,   // ✅ keep restaurant list
    getTotalCartAmount,
    searchQuery,
    setSearchQuery,
    url,
    token,
    setToken
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;

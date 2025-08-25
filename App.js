import React, { useState } from 'react'
import Navbar from './components/Navbar'
import StoreContextProvider from './context/StoreContext'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Cart from './pages/Cart'
import RestaurantPage from './pages/RestaurantPage.jsx'
import LoginPopup from './components/LoginPopup.jsx'
const App = () => {

  const [showLogin, setShowLogin] = useState(false)

  return (
    <div>
      <BrowserRouter>
      <StoreContextProvider>
        {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>}
        <Navbar setShowLogin={setShowLogin}/>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/cart' element={<Cart/>} />
          <Route path="/restaurant/:_id" element={<RestaurantPage />} />        </Routes>
        
      </StoreContextProvider>
      </BrowserRouter>
      
    </div>
  )
}

export default App

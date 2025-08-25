// Navbar.js
import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'
import { StoreContext } from '../context/StoreContext'   

const Navbar = ({setShowLogin}) => {
  const { token, setToken } = useContext(StoreContext)
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/")
  }

  return (
    <div className='navbar'>
      <Link to='/'><img src={assets.logo} alt="" className='logo'/></Link>
      <ul className='navbar-menu'>
        <Link to='/'><li>Home</li></Link>
      </ul>
      <div className='navbar-right'>
        {/* ✅ Only search icon, no text box */}
        <img 
          src={assets.serach} 
          alt="search"
          className="cursor-pointer"
          onClick={() => navigate("/search")}
        />

        <div className='navbar-search-icon'>
          <Link to='/cart'><img src={assets.shopping_basket} alt="" /></Link>
          <div className='dot'></div>
        </div>

        <div>
          {!token ? (
            <button onClick={()=>setShowLogin(true)}>Sign In</button>
          ) : (
            <div className="navbar-profile">
              <img 
                src={assets.profile_icon} 
                alt="profile"
                onClick={logout}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar

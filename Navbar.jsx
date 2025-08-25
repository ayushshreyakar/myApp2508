import React, { useContext, useEffect, useRef, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'
import { StoreContext } from '../context/StoreContext'   
import { FiX } from "react-icons/fi"

const Navbar = ({setShowLogin}) => {
  const { setSearchQuery, restaurants, token, setToken } = useContext(StoreContext)
  const [showSearch, setShowSearch] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [showSuggestions, setShowSuggestions] = useState(false)

  // NEW: profile dropdown toggle + outside click close
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/")
    setProfileOpen(false)
  }

  const handleClear = () => {
    setInputValue("")
    setSearchQuery("")
    setHighlightedIndex(-1)
    setShowSuggestions(false)
  }

  // Flatten all food items from all restaurants
const allFood = restaurants.flatMap(rest => rest.food_list || [])


  const filteredSuggestions = showSuggestions && inputValue
  ? allFood.filter(item =>
      item.name.toLowerCase().includes(inputValue.toLowerCase())
    ).slice(0, 5)
  : []


  const handleSuggestionSelect = (name) => {
    setInputValue(name)
    setSearchQuery(name.toLowerCase())
    setHighlightedIndex(-1)
    setShowSuggestions(false)
  }

  // ✅ Keyboard navigation
  const handleKeyDown = (e) => {
    if (!filteredSuggestions.length) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightedIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : 0
      )
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredSuggestions.length - 1
      )
    } else if (e.key === "Enter" || e.key === "Tab") {
      if (highlightedIndex >= 0) {
        e.preventDefault()
        handleSuggestionSelect(filteredSuggestions[highlightedIndex].name)
      }
    }
  }

  // Close profile menu on outside click or Escape
  useEffect(() => {
    const onClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    const onEsc = (e) => {
      if (e.key === 'Escape') setProfileOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onEsc)
    }
  }, [])

  return (
    <div className='navbar'>
      <Link to='/'><img src={assets.logo} alt="" className='logo'/></Link>
      <ul className='navbar-menu'>
        <Link to='/'><li>Home</li></Link>
      </ul>
      <div className='navbar-right'>
        <img 
          src={assets.serach} 
          alt="search" 
          onClick={() => setShowSearch(!showSearch)} 
          className="cursor-pointer"
        />

        {showSearch && (
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Search dishes..." 
              className="search-input"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                setSearchQuery(e.target.value.toLowerCase())
                setShowSuggestions(true)
              }}
              onKeyDown={handleKeyDown}
            />
            {inputValue && (
              <FiX className="clear-icon" onClick={handleClear} />
            )}

            {filteredSuggestions.length > 0 && (
              <ul className="suggestions-list">
                {filteredSuggestions.map((item, idx) => (
                  <li 
                    key={item._id} 
                    className={idx === highlightedIndex ? "highlighted" : ""}
                    onClick={() => handleSuggestionSelect(item.name)}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className='navbar-search-icon'>
          <Link to= '/cart'><img src={assets.shopping_basket} alt="" /></Link>
          <div className='dot'></div>
        </div>

        <div>
          {!token ? (
            <button onClick={()=>setShowLogin(true)}>Sign In</button>
          ) : (
            <div 
              className={`navbar-profile ${profileOpen ? 'open' : ''}`} 
              ref={profileRef}
            >
              <img 
                src={assets.profile_icon} 
                alt="profile" 
                onClick={() => setProfileOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={profileOpen}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setProfileOpen(v => !v)}
              />
              <ul role="menu">
                <li role="menuitem"><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
                <hr />
                <li role="menuitem" onClick={logout}><img src={assets.logout} alt="" /><p>Logout</p></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar

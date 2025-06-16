import './App.css'
import Home from './pages/Home'
import Posts from './pages/Posts'
import SearchBar from './components/SearchBar'
import { NavLink, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
 
function App() {
    const [searchPlaces, setSearchPlaces] = useState([]);

    const handleSearchPlaces = (results) => {
        console.log(results)
    }
  return (
    <>
    <header id='header'>
      <NavLink to='/' className='logo'>LOGO</NavLink>
      <nav id='nav'>
        <ul>
          <SearchBar className='nav_searchbar' onSearch={handleSearchPlaces}></SearchBar>
          <li><NavLink to='/' className={({ isActive }) => isActive ? 'nav_active' : ''}>홈</NavLink></li>
          <li><NavLink to='/post' className={({ isActive }) => isActive ? 'nav_active' : ''}>제보</NavLink></li>
        </ul>
      </nav>
    </header>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/post' element={<Posts/>}></Route>
      </Routes>
    </>
  )
}

export default App

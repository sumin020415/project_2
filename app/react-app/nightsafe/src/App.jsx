import './App.css'
import Home from './pages/Home'
import Posts from './pages/Posts'
import SearchBar from './components/SearchBar'
import { NavLink, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
 
function App() {
  return (
    <>
    <header id='header'>
      <NavLink to='/' className='logo'>LOGO</NavLink>
      <nav id='nav'>
        <ul>
          <SearchBar className='nav_searchbar' />
          <li><NavLink to='/' className={({ isActive }) => isActive ? 'nav_active' : ''}>홈</NavLink></li>
          <li><NavLink to='/post' className={({ isActive }) => isActive ? 'nav_active' : ''}>제보</NavLink></li>
        </ul>
      </nav>
    </header>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/post' element={<Posts/>} />
      </Routes>
    </>
  )
}

export default App

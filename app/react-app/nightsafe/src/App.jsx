import './App.css'
import Home from './pages/Home'
import Posts from './pages/Posts'
// import Write from './pages/Write'
import Login from './pages/Login'
// import Signup from './pages/signup'

import { NavLink, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <header id='header'>
        <NavLink to='/' className='logo'>LOGO</NavLink>
        <nav id='nav'>
          <ul>
            <li><NavLink to='/' className={({ isActive }) => isActive ? 'nav_active' : ''}>홈</NavLink></li>
            <li><NavLink to='/post' className={({ isActive }) => isActive ? 'nav_active' : ''}>제보</NavLink></li>
            <li><NavLink to='/login' className={({ isActive }) => isActive ? 'nav_active' : ''}>로그인</NavLink></li>
          </ul>
        </nav>
      </header>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/post' element={<Posts />} />
        <Route path='/login' element={<Login />} />
        {/* <Route path='/signup' element={<Signup />} /> */}
        {/* <Route path='/write' element={<Write />} /> */}
      </Routes>
    </>
  )
}

export default App

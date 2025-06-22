import './App.css';
import Home from './pages/Home';
import Posts from './pages/Posts';
import Write from './pages/Write';
import Login from './pages/Login';
import Signup from './pages/signup';
import Analysis from "./pages/Analysis";
import Mypage from "./pages/Mypage";
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import Postdetail from './pages/Postdetail';

import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function AppContent() {
  const { nickname, logout, isLoggedIn } = useAuth(); // useAuth()로 로그인 상태 꺼내기

  return (
    <>
      <header id='header'>
        <NavLink to='/' className='logo'>LOGO</NavLink>
        <nav id='nav'>
          <ul>
            <li><NavLink to='/' className={({ isActive }) => isActive ? 'nav_active' : ''}>홈</NavLink></li>
            <li><NavLink to='/post' className={({ isActive }) => isActive ? 'nav_active' : ''}>제보</NavLink></li>
            <li><NavLink to='/analysis' className={({ isActive }) => isActive ? 'nav_active' : ''}>분석</NavLink></li>
            {
              isLoggedIn ? (
                <>
                  <li className='nickname'>
                    <NavLink to='/mypage' className={({ isActive }) => isActive ? 'nav_active' : ''}>
                      {nickname}님
                    </NavLink>
                  </li>
                  <li><button onClick={logout} className='logout-button'>로그아웃</button></li>
                </>
              ) : (
                <li><NavLink to='/login' className={({ isActive }) => isActive ? 'nav_active' : ''}>로그인</NavLink></li>
              )
            }
          </ul>
        </nav>
      </header>

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/post' element={<Posts />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/write' element={<Write />} />
        <Route path='/analysis' element={<Analysis />} />
        <Route path='/mypage' element={<Mypage />} />
        <Route path="/posts/:postId" element={<Postdetail />} />
      </Routes>
    </>
  );
}

// AuthProvider로 전체 앱을 감싸서 로그인 상태를 전역 공유
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
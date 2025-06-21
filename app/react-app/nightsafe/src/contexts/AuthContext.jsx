import { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';

const AuthContext = createContext(); // 로그인 정보 담기(Context)

export const AuthProvider = ({ children }) => { // 로그인 상태 관리 및 앱 전체에 전달
    const [nickname, setNickname] = useState(null);
    const [userKey, setUserKey] = useState(null);
    const [token, setToken] = useState(null);

    // 로그인 유지 확인(컴포넌트 처음 렌더링될 때, 로그인하거나 localStorage에 값이 있으면 세팅)
    // 페이지 새로고침해도 로그인 유지 가능
    useEffect(() => {
        const storedToken = localStorage.getItem('accessToken');
        const storedNickname = localStorage.getItem('nickname');
        const storedUserKey = localStorage.getItem('userKey');

        if (storedToken) {
            setToken(storedToken);
            setNickname(storedNickname);
            setUserKey(storedUserKey);
        }
    }, []);

    const login = ({ token, nickname, userKey }) => {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('nickname', nickname);
        localStorage.setItem('userKey', userKey);

        setToken(token);
        setNickname(nickname);
        setUserKey(userKey);
    };

    // 로그아웃 처리 함수
    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('nickname');
        localStorage.removeItem('userKey');

        setToken(null);
        setNickname(null);
        setUserKey(null);
    };

    // Context 제공
    return (
        <AuthContext.Provider value={{ token, nickname, userKey, login, logout, isLoggedIn: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

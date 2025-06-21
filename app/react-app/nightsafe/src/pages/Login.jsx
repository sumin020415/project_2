import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './login.module.css';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext'; // 전역 로그인 상태 반영


const Login = () => {
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('id');

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      localStorage.removeItem('accessToken');
    }
  }, []);

  useEffect(() => {
    const handleUnload = () => {
      localStorage.removeItem('accessToken');
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 백엔드에 요청
    try {
      const res = await axios.post('/api/login', {
        userId: userid,
        userPw: password,
      });

      // 응답 받은 거 꺼냄
      const { token, userKey, nickname } = res.data;

      // 전역 상태에 반영
      if (token && userKey) {
        login({ token, userKey, nickname });
        alert(`${nickname}님 환영합니다!`);
        navigate('/');
      } else {
        alert('로그인 실패: 토큰이 없습니다.');
      }
    } catch (error) {
      alert('로그인 실패! 아이디 또는 비밀번호를 확인해주세요.');
    }
  };

  return (
    <section className={style.loginContainer}>
      <h1>로그인</h1>
      <form onSubmit={handleSubmit} className={style.loginForm}>
        <input
          type="text"
          placeholder="아이디"
          value={userid}
          onChange={(e) => setUserid(e.target.value)}
          className={style.loginInput}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={style.loginInput}
          required
        />
        <button type="submit" className={style.loginButton}>
          로그인
        </button>
      </form>

      <ul className={style.subActionList}>
        <li>
          <button
            className={style.subActionButton}
            onClick={() => {
              setIsModalOpen(true);
              setActiveTab('id');
            }}
          >
            아이디/비밀번호 찾기
          </button>
        </li>
        <li>
          <button
            className={style.subActionButton}
            onClick={() => navigate('/signup')}
          >
            회원가입
          </button>
        </li>
      </ul>

      {isModalOpen && (
        <div className={style.modalOverlay}>
          <div className={style.modalContent}>
            <div className={style.modalTabs}>
              <button
                className={`${style.tabButton} ${activeTab === 'id' ? '' : style.activeTab}`}
                onClick={() => setActiveTab('id')}
              >
                아이디 찾기
              </button>
              <button
                className={`${style.tabButton} ${activeTab === 'password' ? '' : style.activeTab}`}
                onClick={() => setActiveTab('password')}
              >
                비밀번호 찾기
              </button>
            </div>

            <h2 className={style.modaltext}>
              {activeTab === 'id' ? '아이디 찾기' : '비밀번호 찾기'}
            </h2>
            <p className={style.modaltext}>
              {activeTab === 'id'
                ? '가입 시 사용한 이메일을 입력하세요.'
                : '비밀번호를 재설정할 아이디를 입력하세요.'}
            </p>

            {activeTab === 'id' && (
              <input
                type="email"
                placeholder="이메일"
                className={style.modalInput}
              />
            )}

            {activeTab === 'password' && (
              <input
                type="text"
                placeholder="아이디"
                className={style.modalInput}
              />
            )}

            <div className={style.modalActions}>
              <button
                onClick={() => {
                  if (activeTab === 'id') {
                    alert('아이디 찾기');
                  } else {
                    alert('비밀번호 찾기');
                  }
                }}
                className={style.modalButton}
              >
                찾기
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className={style.modalButton}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Login;




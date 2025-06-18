import { useState } from 'react'
import style from './login.module.css'

const Login = () => {
  const [userid, setUserid] = useState('')
  const [password, setPassword] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('id')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('로그인 시도:', { userid, password })
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
          <button className={style.subActionButton} onClick={() => {
            setIsModalOpen(true)
            setActiveTab('id')
          }}>
            아이디/비밀번호 찾기
          </button>
        </li>
        <li>
          <button className={style.subActionButton} onClick={() => alert('회원가입')}>
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

            <h2 className={`${style.modaltext}`}>{activeTab === 'id' ? '아이디 찾기' : '비밀번호 찾기'}</h2>
            <p  className={`${style.modaltext}`}>
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
                <button onClick={() => setIsModalOpen(false)} className={style.modalButton}>
                    닫기
                </button>
                </div>
            </div>
        </div>
        )}
    </section>
  )
}

export default Login

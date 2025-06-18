import { useState } from 'react'
import style from './login.module.css'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [userid, setUserid] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('id')
  const navigate = useNavigate()

  const Users = {
    userid: 'a',
    password: '1234',
    email: 'aaa'
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (userid !== Users.userid) {
      alert('잘못된 아이디입니다.')
    } else if (password !== Users.password) {
      alert('비밀번호를 다시 확인해주세요.')
    } else {
      navigate('/')
    }
  }

  const handleFindId = () => {
    if (email.trim() === Users.email) {
      alert(`아이디는 ${Users.userid}입니다`)
    } else {
      alert('등록된 이메일이 없습니다.')
    }
  }

  const handleFindPw = () => {
    if (userid.trim() === Users.userid) {
      alert(`비밀번호는 ${Users.password}입니다`)
    } else {
      alert('등록된 아이디가 없습니다.')
    }
  }

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
            setEmail('')
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
                className={`${style.tabButton} ${activeTab === 'id' ? style.activeTab : ''}`}
                onClick={() => {
                  setActiveTab('id')
                  setEmail('')
                }}
              >
                아이디 찾기
              </button>
              <button
                className={`${style.tabButton} ${activeTab === 'password' ? style.activeTab : ''}`}
                onClick={() => setActiveTab('password')}
              >
                비밀번호 찾기
              </button>
            </div>

            <h2 className={`${style.modaltext}`}>{activeTab === 'id' ? '아이디 찾기' : '비밀번호 찾기'}</h2>
            <p className={`${style.modaltext}`}>
              {activeTab === 'id'
                ? '가입 시 사용한 이메일을 입력하세요.'
                : '비밀번호를 재설정할 아이디를 입력하세요.'}
            </p>

            {activeTab === 'id' && (
              <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={style.modalInput}
              />
            )}

            {activeTab === 'password' && (
              <input
                type="text"
                placeholder="아이디"
                value={userid}
                onChange={(e) => setUserid(e.target.value)}
                className={style.modalInput}
              />
            )}

            <div className={style.modalActions}>
              <button onClick={() => {
                if (activeTab === 'id') {
                  handleFindId()
                } else {
                  handleFindPw()
                }
              }}
                className={style.modalButton}>
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

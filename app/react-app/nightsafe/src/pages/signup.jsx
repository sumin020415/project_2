import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './signup.module.css';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        userId: '',
        userPw: '',
        nickname: '',
        userEmail: '',
    });

    const [emailValid, setEmailValid] = useState(false);
    const [idDuplicate, setIdDuplicate] = useState(null);
    const [emailDuplicate, setEmailDuplicate] = useState(null);
    const [idChecked, setIdChecked] = useState(false);
    const [emailChecked, setEmailChecked] = useState(false);

    useEffect(() => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmailValid(regex.test(formData.userEmail));
    }, [formData.userEmail]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (e.target.name === 'userId') {
            setIdDuplicate(null);
            setIdChecked(false);
        }
        if (e.target.name === 'userEmail') {
            setEmailDuplicate(null);
            setEmailChecked(false);
        }
    };

    const checkId = async () => {
        if (!formData.userId) return;
        try {
            const res = await axios.get(`/api/check-id?id=${formData.userId}`);
            setIdDuplicate(res.data.duplicate);
            setIdChecked(true);
        } catch (err) {
            console.error('아이디 중복 확인 오류', err);
        }
    };

    const checkEmail = async () => {
        if (!emailValid) return;
        try {
            const res = await axios.get(`/api/check-email?email=${formData.userEmail}`);
            setEmailDuplicate(res.data.duplicate);
            setEmailChecked(true);
        } catch (err) {
            console.error('이메일 중복 확인 오류', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!idChecked || idDuplicate !== false) {
            alert('아이디 중복확인이 필요합니다.');
            return;
        }
        if (!emailChecked || !emailValid || emailDuplicate !== false) {
            alert('이메일 중복확인이 필요합니다.');
            return;
        }

        try {
            const res = await axios.post('/api/register', formData);
            alert(res.data);
            navigate('/login');
        } catch (error) {
            console.error('회원가입 실패', error);
            alert('회원가입 실패!');
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2 className={styles.title}>회원가입</h2>

                <div className={styles.fieldRow}>
                    <div className={styles.inputGroup}>
                        <input
                            name="userId"
                            id="userId"
                            onChange={handleChange}
                            value={formData.userId}
                            required
                            placeholder='아이디'
                        />
                        <button type="button" className={styles.checkButton} onClick={checkId}>
                            중복확인
                        </button>
                    </div>
                    {idDuplicate === false && <span style={{ color: 'green', fontSize: '13px' }}>사용 가능한 아이디입니다.</span>}
                    {idDuplicate === true && <span className={styles.errorMsg}>이미 사용 중인 아이디입니다.</span>}
                </div>

                <div className={styles.fieldRow}>
                    <input
                        name="userPw"
                        id="userPw"
                        type="password"
                        onChange={handleChange}
                        value={formData.userPw}
                        required
                        placeholder='비밀번호'
                    />
                </div>

                <div className={styles.fieldRow}>
                    <input
                        name="nickname"
                        id="nickname"
                        onChange={handleChange}
                        value={formData.nickname}
                        placeholder='닉네임'
                    />
                </div>

                <div className={styles.fieldRow}>
                    <div className={styles.inputGroup}>
                        <input
                            name="userEmail"
                            id="userEmail"
                            onChange={handleChange}
                            value={formData.userEmail}
                            required
                            placeholder='이메일'
                        />
                        <button type="button" className={styles.checkButton} onClick={checkEmail}>
                            중복확인
                        </button>
                    </div>
                    {!emailValid && formData.userEmail && (
                        <span className={styles.errorMsg}>올바른 이메일 형식이 아닙니다.</span>
                    )}
                    {emailValid && emailDuplicate === false && <span style={{ color: 'green', fontSize: '13px' }}>사용 가능한 이메일입니다.</span>}
                    {emailValid && emailDuplicate === true && <span className={styles.errorMsg}>이미 등록된 이메일입니다.</span>}
                </div>

                <button type="submit" className={styles.submitButton}>
                    가입하기
                </button>
            </form>
        </div>
    );
}

export default Signup;
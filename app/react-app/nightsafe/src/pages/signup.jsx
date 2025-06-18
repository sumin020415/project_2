import React, { useState, useEffect } from 'react';
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

    // 중복 체크 변수들 주석처리
    // const [emailDuplicate, setEmailDuplicate] = useState(true);
    // const [idDuplicate, setIdDuplicate] = useState(true);

    useEffect(() => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmailValid(regex.test(formData.userEmail));
    }, [formData.userEmail]);

    // 이메일 중복 확인 주석처리
    /*
    useEffect(() => {
        const checkEmail = async () => {
            if (emailValid) {
                try {
                    const res = await axios.get(`http://localhost:8080/api/check-email?email=${formData.userEmail}`);
                    setEmailDuplicate(res.data.duplicate);
                } catch (err) {
                    console.error('이메일 중복 확인 실패', err);
                }
            }
        };
        checkEmail();
    }, [formData.userEmail, emailValid]);
    */

    // 아이디 중복 확인
    /*
    useEffect(() => {
        const checkId = async () => {
            if (formData.userId.length > 0) {
                try {
                    const res = await axios.get(`http://localhost:8080/api/check-id?id=${formData.userId}`);
                    setIdDuplicate(res.data.duplicate);
                } catch (err) {
                    console.error('아이디 중복 확인 실패', err);
                }
            }
        };
        checkId();
    }, [formData.userId]);
    */

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/register', formData);
            alert('✅ 회원가입 완료!');
            navigate('/login');
        } catch (error) {
            console.error('회원가입 실패', error);
            alert('❌ 회원가입 실패!');
        }
    };

    // 중복 검사 조건 제거
    const isDisabled = !emailValid; // 원래는 || emailDuplicate || idDuplicate

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>회원가입</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="userId">아이디</label>
                    <input
                        name="userId"
                        id="userId"
                        className={`${styles.inputBox} ${styles.inputBoxAccent}`}
                        onChange={handleChange}
                        required
                    />
                    {/* 
                    {!idDuplicate && <span className={styles.validMsg}>사용 가능한 아이디입니다.</span>}
                    {idDuplicate && formData.userId && <span className={styles.errorMsg}>이미 사용 중인 아이디입니다.</span>}
                    */}
                </div>

                <div>
                    <label htmlFor="userPw">비밀번호</label>
                    <input
                        name="userPw"
                        id="userPw"
                        type="password"
                        className={styles.inputBox}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="nickname">닉네임</label>
                    <input
                        name="nickname"
                        id="nickname"
                        className={styles.inputBox}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label htmlFor="userEmail">이메일</label>
                    <input
                        name="userEmail"
                        id="userEmail"
                        className={styles.inputBox}
                        onChange={handleChange}
                        required
                    />
                    {!emailValid && formData.userEmail && <span className={styles.errorMsg}>올바른 이메일 형식이 아닙니다.</span>}
                    {/* 
                    {emailValid && !emailDuplicate && <span className={styles.validMsg}>사용 가능한 이메일입니다.</span>}
                    {emailValid && emailDuplicate && <span className={styles.errorMsg}>이미 등록된 이메일입니다.</span>}
                    */}
                </div>

                <button type="submit" className={styles.submitButton} disabled={isDisabled}>
                    가입하기
                </button>
            </form>
        </div>
    );
}

export default Signup;

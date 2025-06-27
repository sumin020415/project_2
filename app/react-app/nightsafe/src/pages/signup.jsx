// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import styles from './signup.module.css';
// import { useNavigate } from 'react-router-dom';

// function Signup() {
//     const navigate = useNavigate();

//     const [formData, setFormData] = useState({
//         userId: '',
//         userPw: '',
//         nickname: '',
//         userEmail: '',
//     });

//     const [emailValid, setEmailValid] = useState(false);
//     const [idDuplicate, setIdDuplicate] = useState(null);
//     const [emailDuplicate, setEmailDuplicate] = useState(null);
//     const [idChecked, setIdChecked] = useState(false);
//     const [emailChecked, setEmailChecked] = useState(false);

//     useEffect(() => {
//         const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         setEmailValid(regex.test(formData.userEmail));
//     }, [formData.userEmail]);

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//         if (e.target.name === 'userId') {
//             setIdDuplicate(null);
//             setIdChecked(false);
//         }
//         if (e.target.name === 'userEmail') {
//             setEmailDuplicate(null);
//             setEmailChecked(false);
//         }
//     };

//     const checkId = async () => {
//         if (!formData.userId) return;
//         try {
//             const res = await axios.get(`/api/check-id?id=${formData.userId}`);
//             setIdDuplicate(res.data.duplicate);
//             setIdChecked(true);
//         } catch (err) {
//             console.error('아이디 중복 확인 오류', err);
//         }
//     };

//     const checkEmail = async () => {
//         if (!emailValid) return;
//         try {
//             const res = await axios.get(`/api/check-email?email=${formData.userEmail}`);
//             setEmailDuplicate(res.data.duplicate);
//             setEmailChecked(true);
//         } catch (err) {
//             console.error('이메일 중복 확인 오류', err);
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!idChecked || idDuplicate !== false) {
//             alert('아이디 중복확인이 필요합니다.');
//             return;
//         }
//         if (!emailChecked || !emailValid || emailDuplicate !== false) {
//             alert('이메일 중복확인이 필요합니다.');
//             return;
//         }

//         try {
//             const res = await axios.post('/api/register', formData);
//             alert(res.data);
//             navigate('/login');
//         } catch (error) {
//             console.error('회원가입 실패', error);
//             alert('회원가입 실패!');
//         }
//     };

//     return (
//         <div className={styles.container}>
//             <form onSubmit={handleSubmit} className={styles.form}>
//                 <h2 className={styles.title}>회원가입</h2>

//                 <div className={styles.fieldRow}>
//                     <div className={styles.inputGroup}>
//                         <input
//                             name="userId"
//                             id="userId"
//                             onChange={handleChange}
//                             value={formData.userId}
//                             required
//                             placeholder='아이디'
//                         />
//                         <button type="button" className={styles.checkButton} onClick={checkId}>
//                             중복확인
//                         </button>
//                     </div>
//                     {idDuplicate === false && <span style={{ color: 'green', fontSize: '13px' }}>사용 가능한 아이디입니다.</span>}
//                     {idDuplicate === true && <span className={styles.errorMsg}>이미 사용 중인 아이디입니다.</span>}
//                 </div>

//                 <div className={styles.fieldRow}>
//                     <input
//                         name="userPw"
//                         id="userPw"
//                         type="password"
//                         onChange={handleChange}
//                         value={formData.userPw}
//                         required
//                         placeholder='비밀번호'
//                     />
//                 </div>

//                 <div className={styles.fieldRow}>
//                     <input
//                         name="nickname"
//                         id="nickname"
//                         onChange={handleChange}
//                         value={formData.nickname}
//                         placeholder='닉네임'
//                     />
//                 </div>

//                 <div className={styles.fieldRow}>
//                     <div className={styles.inputGroup}>
//                         <input
//                             name="userEmail"
//                             id="userEmail"
//                             onChange={handleChange}
//                             value={formData.userEmail}
//                             required
//                             placeholder='이메일'
//                         />
//                         <button type="button" className={styles.checkButton} onClick={checkEmail}>
//                             중복확인
//                         </button>
//                     </div>
//                     {!emailValid && formData.userEmail && (
//                         <span className={styles.errorMsg}>올바른 이메일 형식이 아닙니다.</span>
//                     )}
//                     {emailValid && emailDuplicate === false && <span style={{ color: 'green', fontSize: '13px' }}>사용 가능한 이메일입니다.</span>}
//                     {emailValid && emailDuplicate === true && <span className={styles.errorMsg}>이미 등록된 이메일입니다.</span>}
//                 </div>

//                 <button type="submit" className={styles.submitButton}>
//                     가입하기
//                 </button>
//             </form>
//         </div>
//     );
// }

// export default Signup;


import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './signup.module.css';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        userId: '',
        userPw: '',
        confirmPw: '',
        nickname: '',
        emailId: '',
        emailDomain: '',
    });

    const [emailValid, setEmailValid] = useState(false);
    const [idDuplicate, setIdDuplicate] = useState(null);
    const [emailDuplicate, setEmailDuplicate] = useState(null);
    const [nicknameDuplicate, setNicknameDuplicate] = useState(null);
    const [idChecked, setIdChecked] = useState(false);
    const [emailChecked, setEmailChecked] = useState(false);
    const [nicknameChecked, setNicknameChecked] = useState(false);
    const [pwMatch, setPwMatch] = useState(true);
    const [customDomain, setCustomDomain] = useState(false);

    const fullEmail = `${formData.emailId}@${formData.emailDomain}`;

    useEffect(() => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmailValid(regex.test(fullEmail));
    }, [formData.emailId, formData.emailDomain]);

    useEffect(() => {
        setPwMatch(formData.userPw === formData.confirmPw);
    }, [formData.userPw, formData.confirmPw]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (e.target.name === 'userId') {
            setIdDuplicate(null);
            setIdChecked(false);
        }
        if (e.target.name === 'emailId' || e.target.name === 'emailDomain') {
            setEmailDuplicate(null);
            setEmailChecked(false);
        }
        if (e.target.name === 'nickname') {
            setNicknameDuplicate(null);
            setNicknameChecked(false);
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
            const res = await axios.get(`/api/check-email?email=${fullEmail}`);
            setEmailDuplicate(res.data.duplicate);
            setEmailChecked(true);
        } catch (err) {
            console.error('이메일 중복 확인 오류', err);
        }
    };

    const checkNickname = async () => {
        if (!formData.nickname) return;
        try {
            const res = await axios.get(`/api/check-nickname?nickname=${formData.nickname}`);
            setNicknameDuplicate(res.data.duplicate);
            setNicknameChecked(true);
        } catch (err) {
            console.error('닉네임 중복 확인 오류', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!idChecked || idDuplicate !== false) {
            alert('아이디 중복확인이 필요합니다.');
            return;
        }
        if (!nicknameChecked || nicknameDuplicate !== false) {
            alert('닉네임 중복확인이 필요합니다.');
            return;
        }
        if (!emailChecked || !emailValid || emailDuplicate !== false) {
            alert('이메일 중복확인이 필요합니다.');
            return;
        }
        if (!pwMatch) {
            alert('비밀번호와 확인 비밀번호가 일치해야 합니다.');
            return;
        }

        try {
            const res = await axios.post('/api/register', {
                userId: formData.userId,
                userPw: formData.userPw,
                nickname: formData.nickname,
                userEmail: fullEmail,
            });
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
                            onChange={handleChange}
                            value={formData.userId}
                            required
                            placeholder="아이디"
                            className={styles.signupInput}
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
                        type="password"
                        onChange={handleChange}
                        value={formData.userPw}
                        required
                        placeholder="비밀번호"
                        className={styles.signupInput}
                    />
                </div>

                <div className={styles.fieldRow}>
                    <input
                        name="confirmPw"
                        type="password"
                        onChange={handleChange}
                        value={formData.confirmPw}
                        required
                        placeholder="비밀번호 확인"
                        className={styles.signupInput}
                    />
                    {formData.confirmPw && !pwMatch && (
                        <span className={styles.errorMsg}>비밀번호가 일치하지 않습니다.</span>
                    )}
                </div>

                <div className={styles.fieldRow}>
                    <div className={styles.inputGroup}>
                        <input
                            name="nickname"
                            onChange={handleChange}
                            value={formData.nickname}
                            placeholder="닉네임"
                            className={styles.signupInput}
                        />
                        <button type="button" className={styles.checkButton} onClick={checkNickname}>
                            중복확인
                        </button>
                    </div>
                    {nicknameChecked && nicknameDuplicate === false && <span style={{ color: 'green', fontSize: '13px' }}>사용 가능한 닉네임입니다.</span>}
                    {nicknameChecked && nicknameDuplicate === true && <span className={styles.errorMsg}>이미 사용 중인 닉네임입니다.</span>}
                </div>

                <div className={styles.fieldRow}>
                    <div className={styles.inputGroup}>
                        <input
                            name="emailId"
                            onChange={handleChange}
                            value={formData.emailId}
                            required
                            placeholder="이메일 아이디"
                            className={styles.signupInput}
                            style={{ width: 'calc(50% - 10px)' }}
                        />
                        <span className={styles.atSymbol}>@</span>
                        {customDomain ? (
                            <input
                                name="emailDomain"
                                onChange={handleChange}
                                value={formData.emailDomain}
                                required
                                placeholder="도메인 입력"
                                className={styles.domainInput}
                                style={{ width: 'calc(50% - 10px)' }}
                            />
                        ) : (
                            <select
                                name="emailDomain"
                                value={formData.emailDomain}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setCustomDomain(val === 'custom');
                                    setFormData((prev) => ({
                                        ...prev,
                                        emailDomain: val === 'custom' ? '' : val,
                                    }));
                                }}
                                className={styles.signupSelect}
                                style={{ width: 'calc(50% - 10px)' }}
                            >
                                <option value="">도메인 선택</option>
                                <option value="gmail.com">gmail.com</option>
                                <option value="naver.com">naver.com</option>
                                <option value="daum.net">daum.net</option>
                                <option value="kakao.com">kakao.com</option>
                                <option value="custom">직접 입력</option>
                            </select>
                        )}
                        <button type="button" className={styles.checkButton} onClick={checkEmail}>
                            중복확인
                        </button>
                    </div>
                    {(formData.emailId || formData.emailDomain) && !emailValid && (
                        <span className={styles.errorMsg}>올바른 이메일 형식이 아닙니다.</span>
                    )}
                    {emailValid && emailDuplicate === false && (
                        <span style={{ color: 'green', fontSize: '13px' }}>사용 가능한 이메일입니다.</span>
                    )}
                    {emailValid && emailDuplicate === true && (
                        <span className={styles.errorMsg}>이미 등록된 이메일입니다.</span>
                    )}
                </div>

                <button type="submit" className={styles.submitButton}>가입하기</button>
            </form>
        </div>
    );
}

export default Signup;
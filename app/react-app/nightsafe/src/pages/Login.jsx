import { useState } from 'react';

const Login = () => {
    const [userid, setUserid] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e) => {
    e.preventDefault()
    
    console.log('로그인 시도:', { username, password })
    }

    return(
        <section id="login" data-page="login">
	        <h1>로그인</h1>
        </section>
    )
}

export default Login
import React, { useContext } from 'react'
import styles from './Login.module.css';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import GoogleIcon from '@mui/icons-material/Google';

import { auth, provider } from '../../utils/firebase';
import { signInWithPopup } from 'firebase/auth';
import { AuthContext } from '../../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';

const Login = () => {

    const { isLogin, setLogin, userInfo, setUserInfo } = useContext(AuthContext);
    const navigate = useNavigate();
    const handleLogin = async () => {
        try {
            // Google sign-in
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const payload = {
                name: user.displayName,
                email: user.email,
                photoUrl: user.photoURL
            };

            // Save / register user on backend (best-effort)
            try {
                const res = await axios.post('/api/user', payload);
                if (res?.data?.user) {
                    setUserInfo(res.data.user);
                    localStorage.setItem('userInfo', JSON.stringify(res.data.user));
                } else {
                    setUserInfo(payload);
                    localStorage.setItem('userInfo', JSON.stringify(payload));
                }
            } catch (e) {
                // backend might be incomplete; still proceed with client-side user
                setUserInfo(payload);
                localStorage.setItem('userInfo', JSON.stringify(payload));
            }

            setLogin(true);
            localStorage.setItem("isLogin", true)

            navigate('/dashboard')
        } catch (err) {
            alert("Something Went Wrong");
            console.log(err)
        }
    }
    return (
        <div className={styles.Login}>
            <div className={styles.loginCard}>
                <div className={styles.loginCardTitle}>
                    <h1>Login </h1>
                    <VpnKeyIcon />
                </div>

                <div className={styles.googleBtn} onClick={handleLogin}><GoogleIcon sx={{ fontSize: 20, color: "red" }} /> Sign in with Google</div>

            </div>
        </div>
    )
}

export default Login
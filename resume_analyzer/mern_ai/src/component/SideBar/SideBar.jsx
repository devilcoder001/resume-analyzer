import React from 'react'
import styles from './SideBar.module.css';
import ArticleIcon from '@mui/icons-material/Article';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../utils/AuthContext';
import { auth } from '../../utils/firebase';
import { signOut } from 'firebase/auth';

const SideBar = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const { isLogin, setLogin, userInfo, setUserInfo } = useContext(AuthContext);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.warn('Firebase signOut failed', err);
        }
        setLogin(false);
        setUserInfo(null);
        localStorage.removeItem('isLogin');
        localStorage.removeItem('userInfo');
        navigate('/');
    }
    return (
        <div className={styles.sideBar}>
            <div className={styles.sideBarIcon}>
                <ArticleIcon sx={{ fontSize: 54, marginBottom: 2 }} />
                <div className={styles.sideBarTopContent}>Resume Screening</div>
            </div>

            <div className={styles.sideBarOptionsBlock}>

                {/* Please watch the video for ful source code */}


                <Link to={'/history'} className={[styles.sideBarOption, location.pathname === '/history' ? styles.selectedOption : null].join(' ')}>
                    <ManageSearchIcon sx={{ fontSize: 22 }} />
                    <div>History</div>
                </Link>
                {/* Please watch the video for ful source code */}
                <div onClick={handleLogout} className={styles.sideBarOption}>
                    <LogoutIcon sx={{ fontSize: 22 }} />
                    <div>LogOut</div>
                </div>

            </div>
        </div>
    )
}

export default SideBar
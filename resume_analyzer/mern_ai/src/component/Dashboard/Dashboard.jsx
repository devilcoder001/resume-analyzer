
import styles from './Dashboard.module.css'
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import Skeleton from '@mui/material/Skeleton';
import WithAuthHOC from '../../utils/HOC/withAuthHOC';
import { useState } from 'react';
import axios from '../../utils/axios';
import { useContext } from 'react';
import { AuthContext } from '../../utils/AuthContext';

const Dashboard = () => {
    const [uploadFiletext, setUploadFileText] = useState("Upload your resume");
    const [loading, setLoading] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [jobDesc, setJobDesc] = useState("");

    const [result, setResult] = useState(null);

    const { userInfo } = useContext(AuthContext);

    const handleOnChangeFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setResumeFile(file);
        setUploadFileText(file.name)
    }

    const handleUpload = async () => {
        try {
            if (!resumeFile) {
                alert('Please choose a PDF resume first');
                return;
            }
            if (!jobDesc.trim()) {
                alert('Please paste the job description');
                return;
            }

            setLoading(true);

            const formData = new FormData();
            formData.append('resume', resumeFile);
            formData.append('job_desc', jobDesc);
            formData.append('user', userInfo?.email || userInfo?._id || '');

            const response = await axios.post('/api/resume/addResume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setResult(response.data.data);
        } catch (err) {
            console.error(err);
            alert(err?.response?.data?.message || 'Failed to analyze resume');
        } finally {
            setLoading(false);
        }

    }

    return (
        <div className={styles.Dashboard}>
            <div className={styles.DashboardLeft}>
                <div className={styles.DashboardHeader}>
                                        {/* Please watch the video for ful source code */}

                </div>

                <div className={styles.alertInfo}>
                                        {/* Please watch the video for ful source code */}

                </div>

                <div className={styles.DashboardUploadResume}>
                    <div className={styles.DashboardResumeBlock}>{uploadFiletext}</div>
                    <div className={styles.DashboardInputField}>
                        <label className={styles.analyzeAIBtn}>
                            Choose PDF
                            <input type="file" accept="application/pdf" onChange={handleOnChangeFile} />
                        </label>
                    </div>
                </div>

                <div className={styles.jobDesc}>
                    <textarea value={jobDesc} onChange={(e) => { setJobDesc(e.target.value) }} className={styles.textArea} placeholder='Paste Your Job Description' rows={10} cols={50} />
                    <div className={styles.AnalyzeBtn} onClick={handleUpload} >Analyze</div>
                </div>
            </div>

            <div className={styles.DashboardRight}>
                <div className={styles.DashboardRightTopCard}>
                    <div>Analyze With AI</div>

                    {userInfo?.photoUrl ? <img className={styles.profileImg} src={userInfo.photoUrl} alt="Profile" /> : <div className={styles.profileImg} />}

                    <h2>{userInfo?.name}</h2>
                </div>


                {
                    result && <div className={styles.DashboardRightTopCard}>
                        <div>Result</div>

                        <CreditScoreIcon sx={{ fontSize: 58, color: 'green', marginTop: 2 }} />
                        <h1>{result.score}%</h1>
                        <p style={{ textAlign: 'center' }}>{result.feedback}</p>
                        
                    </div>
                }

                {
                    loading && <Skeleton variant="rectangular" sx={{ borderRadius: "20px" }} width={280} height={280} />
                }


            </div>

        </div>


    )
}

export default WithAuthHOC(Dashboard)
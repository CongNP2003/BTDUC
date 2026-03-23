import { useState } from "react";
import { loginApi } from "../api/authApi";
import { useNavigate } from "react-router-dom";
 
function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
 
    const navigate = useNavigate();
 
    const handleLogin = async () => {
        setLoading(true);
        try {
            const res = await loginApi({ username, password });
            const token = res.result;
            if (!token) throw new Error("Không nhận được token");
            localStorage.setItem("token", token);
            navigate("/admin");
        } catch (error) {
            console.error("Login error:", error);
            alert("Sai tài khoản hoặc mật khẩu");
        } finally {
            setLoading(false);
        }
    };
 
    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleLogin();
    };
 
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Lato:wght@300;400;700&display=swap');
 
                * { box-sizing: border-box; margin: 0; padding: 0; }
 
                .login-root {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #e8f4fd 0%, #f0f9ff 40%, #ffffff 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Lato', sans-serif;
                    position: relative;
                    overflow: hidden;
                }
 
                .login-root::before {
                    content: '';
                    position: absolute;
                    width: 600px;
                    height: 600px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(147,210,247,0.18) 0%, transparent 70%);
                    top: -150px;
                    left: -150px;
                    pointer-events: none;
                }
 
                .login-root::after {
                    content: '';
                    position: absolute;
                    width: 400px;
                    height: 400px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(100,181,246,0.12) 0%, transparent 70%);
                    bottom: -100px;
                    right: -80px;
                    pointer-events: none;
                }
 
                .login-card {
                    background: #ffffff;
                    border-radius: 24px;
                    box-shadow: 0 8px 40px rgba(30, 136, 229, 0.10), 0 2px 8px rgba(0,0,0,0.06);
                    padding: 52px 48px 44px;
                    width: 100%;
                    max-width: 420px;
                    position: relative;
                    z-index: 1;
                    animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
                }
 
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(28px); }
                    to { opacity: 1; transform: translateY(0); }
                }
 
                .login-logo {
                    width: 52px;
                    height: 52px;
                    background: linear-gradient(135deg, #42a5f5, #1976d2);
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 28px;
                    box-shadow: 0 4px 16px rgba(25, 118, 210, 0.25);
                }
 
                .login-logo svg {
                    width: 28px; height: 28px; fill: white;
                }
 
                .login-title {
                    font-family: 'Nunito', sans-serif;
                    font-size: 26px;
                    font-weight: 800;
                    color: #1a2740;
                    margin-bottom: 6px;
                    letter-spacing: -0.5px;
                }
 
                .login-subtitle {
                    font-size: 14px;
                    color: #7a94b0;
                    margin-bottom: 36px;
                    font-weight: 400;
                }
 
                .field-label {
                    font-size: 13px;
                    font-weight: 700;
                    color: #4a6080;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                    margin-bottom: 8px;
                    display: block;
                }
 
                .field-wrap {
                    position: relative;
                    margin-bottom: 20px;
                }
 
                .field-icon {
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #90bcd9;
                    pointer-events: none;
                }
 
                .login-input {
                    width: 100%;
                    padding: 13px 16px 13px 44px;
                    border: 1.5px solid #d6e8f7;
                    border-radius: 12px;
                    font-size: 15px;
                    font-family: 'Lato', sans-serif;
                    color: #1a2740;
                    background: #f5fbff;
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
                }
 
                .login-input::placeholder { color: #b0cfe8; }
 
                .login-input:focus {
                    border-color: #42a5f5;
                    background: #ffffff;
                    box-shadow: 0 0 0 4px rgba(66, 165, 245, 0.12);
                }
 
                .login-btn {
                    width: 100%;
                    padding: 14px;
                    background: linear-gradient(135deg, #42a5f5 0%, #1976d2 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 15px;
                    font-family: 'Nunito', sans-serif;
                    font-weight: 700;
                    letter-spacing: 0.4px;
                    cursor: pointer;
                    margin-top: 8px;
                    transition: transform 0.15s, box-shadow 0.2s, filter 0.2s;
                    box-shadow: 0 4px 16px rgba(25, 118, 210, 0.28);
                    position: relative;
                    overflow: hidden;
                }
 
                .login-btn:hover:not(:disabled) {
                    filter: brightness(1.07);
                    transform: translateY(-1px);
                    box-shadow: 0 6px 22px rgba(25, 118, 210, 0.36);
                }
 
                .login-btn:active:not(:disabled) {
                    transform: translateY(0);
                }
 
                .login-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
 
                .login-footer {
                    margin-top: 24px;
                    text-align: center;
                    font-size: 13px;
                    color: #9db4cc;
                }
 
                .login-footer a {
                    color: #42a5f5;
                    text-decoration: none;
                    font-weight: 600;
                }
            `}</style>
 
            <div className="login-root">
                <div className="login-card">
                    <div className="login-logo">
                        <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
                    </div>
 
                    <div className="login-title">Chào mừng trở lại</div>
                    <div className="login-subtitle">Đăng nhập để tiếp tục quản lý hệ thống</div>
 
                    <div className="field-wrap">
                        <label className="field-label">Tài khoản</label>
                        <span className="field-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                        </span>
                        <input
                            className="login-input"
                            placeholder="Nhập tên đăng nhập"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
 
                    <div className="field-wrap">
                        <label className="field-label">Mật khẩu</label>
                        <span className="field-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
                        </span>
                        <input
                            type="password"
                            className="login-input"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
 
                    <button className="login-btn" onClick={handleLogin} disabled={loading}>
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
 
                    <div className="login-footer">
                        Quên mật khẩu? <a href="#">Liên hệ quản trị viên</a>
                    </div>
                </div>
            </div>
        </>
    );
}
 
export default Login;
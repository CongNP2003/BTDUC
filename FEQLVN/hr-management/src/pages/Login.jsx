import { useState } from "react";
import { loginApi } from "../api/authApi";
import { useNavigate } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await loginApi({ username, password });

            const { accessToken, role } = res.data;

            localStorage.setItem("token", accessToken);
            localStorage.setItem("role", role);

            if (role === "ADMIN") {
                navigate("/admin");
            } else {
                navigate("/user");
            }
        } catch {
            alert("Login thất bại");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Đăng nhập</h2>
            <input
                className="form-control mb-2"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                className="form-control mb-2"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleLogin}>
                Login
            </button>
        </div>
    );
}

export default Login;
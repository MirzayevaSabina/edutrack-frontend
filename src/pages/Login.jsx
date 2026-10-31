import { useState } from "react";
import axios from "axios";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "https://edutrack-backend-cx06.onrender.com/auth/login",
                {
                    username: username,
                    password: password
                }
            );

            localStorage.setItem("token", response.data.token);

            alert("Login successful!");

            window.location.href = "/students";

        } catch (error) {
            console.error(error);
            alert("Login failed!");
        }
    };

    return (
        <div>
            <h1>EduTrack</h1>

            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;
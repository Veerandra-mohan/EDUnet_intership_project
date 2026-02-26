import { useState } from "react";
import { useNavigate } from "react-router-dom";
import owlHead from "../components/owl/owlhead.svg";

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [isLight, setIsLight] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, perform authentication here
        navigate("/dashboard");
    };

    return (
        <div className={`auth-container ${isLight ? "light-theme" : "dark-theme"}`}>
            <button
                className="theme-toggle"
                onClick={() => setIsLight(!isLight)}
            >
                {isLight ? "Dark Mode 🌙" : "Light Mode ☀️"}
            </button>

            <div className="auth-wrapper">
                <div className={`owl-container ${isPasswordFocused ? "closed" : ""}`}>
                    <img src={owlHead} alt="Owl" className="owl-img" style={{ maxWidth: '200px', height: 'auto', display: 'block', margin: '0 auto' }} />
                </div>

                <div className="auth-card">
                    <h1>DeepInspection AI</h1>
                    <p className="subtitle">
                        {isLogin ? "Welcome Back!" : "Create account"}
                    </p>

                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <>
                                <div className="form-group">
                                    <input className="form-input" type="text" placeholder="Name" required />
                                </div>
                                <div className="form-group">
                                    <input className="form-input" type="text" placeholder="Username" required />
                                </div>
                            </>
                        )}

                        <div className="form-group">
                            <input className="form-input" type="email" placeholder="Email" required />
                        </div>

                        <div className="form-group">
                            <input
                                className="form-input"
                                type="password"
                                placeholder="Password"
                                required
                                onFocus={() => setIsPasswordFocused(true)}
                                onBlur={() => setIsPasswordFocused(false)}
                            />
                        </div>

                        <button type="submit" className="auth-btn">
                            {isLogin ? "Login" : "Register"}
                        </button>
                    </form>

                    <div className="auth-footer">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button type="button" className="auth-link" onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? "Register" : "Login"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


import { useState } from "react";
import api from "@/api";
import { useNavigate, Link } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";
import '@/styles/Form.css';
import PV2 from "@/styles/PV2.png";
import { CalendarSearch, MessageSquareHeart, BarChart3 } from 'lucide-react';

/* ── Feature card illustrations ──────────────────────────────────── */
const FEATURES = [
    {
        icon: CalendarSearch,
        gradient: "linear-gradient(160deg, #4f46e5 0%, #7c3aed 100%)",
        accent: "#a78bfa",
        title: "Discover Events",
        desc: "Browse & post upcoming fundraiser events across campus",
        decoration: (
            <svg className="feat-deco" viewBox="0 0 100 80" fill="none">
                <circle cx="80" cy="10" r="28" fill="white" opacity="0.06" />
                <circle cx="15" cy="65" r="18" fill="white" opacity="0.06" />
                <rect x="20" y="20" width="42" height="36" rx="6" fill="white" opacity="0.08" />
            </svg>
        ),
    },
    {
        icon: MessageSquareHeart,
        gradient: "linear-gradient(160deg, #be185d 0%, #9333ea 100%)",
        accent: "#f472b6",
        title: "Negotiate Offers",
        desc: "Chat, pitch & close deals with organisations in real-time",
        decoration: (
            <svg className="feat-deco" viewBox="0 0 100 80" fill="none">
                <circle cx="85" cy="15" r="22" fill="white" opacity="0.06" />
                <ellipse cx="30" cy="55" rx="24" ry="18" fill="white" opacity="0.06" />
                <rect x="25" y="18" width="50" height="32" rx="10" fill="white" opacity="0.08" />
            </svg>
        ),
    },
    {
        icon: BarChart3,
        gradient: "linear-gradient(160deg, #0369a1 0%, #4f46e5 100%)",
        accent: "#38bdf8",
        title: "Track Inventory",
        desc: "Manage products, log sales & analyse revenue live on-site",
        decoration: (
            <svg className="feat-deco" viewBox="0 0 100 80" fill="none">
                <circle cx="82" cy="12" r="25" fill="white" opacity="0.06" />
                <rect x="12" y="44" width="14" height="22" rx="3" fill="white" opacity="0.1" />
                <rect x="32" y="32" width="14" height="34" rx="3" fill="white" opacity="0.1" />
                <rect x="52" y="20" width="14" height="46" rx="3" fill="white" opacity="0.1" />
            </svg>
        ),
    },
];

/* ── Main component ──────────────────────────────────────────────── */
const Form = ({ route, method }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [userType, setUserType] = useState("organization");
    const [wrongRegister, setWrongRegister] = useState({});
    const [wrongLogin, setWrongLogin] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const isLogin = method === "login";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setWrongLogin(false);
        setWrongRegister({});

        try {
            const info = { username, password };
            if (!isLogin) { info.role = userType; info.email = email; }

            const res = await api.post(route, info);

            if (isLogin) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                localStorage.setItem("username", username);
                try {
                    const profileRes = await api.get("core/user/profile/");
                    localStorage.setItem("ROLE", profileRes.data.role);
                } catch (err) {
                    console.error("Failed to fetch profile after login:", err);
                }
                navigate("/");
            } else {
                navigate("/login");
            }
        } catch (error) {
            if (isLogin) setWrongLogin(true);
            else setWrongRegister(error.response?.data ?? {});
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-root">
            {/* ── Brand panel ── */}
            <div className="brand-panel">
                <div className="orb orb-1" />
                <div className="orb orb-2" />
                <div className="orb orb-3" />

                <div className="brand-content">
                    <img src={PV2} alt="ProjectVendor" className="brand-logo-img" />

                    <p className="brand-tagline">
                        Connecting organisations with local vendors seamlessly.
                    </p>

                    {/* portrait feature cards */}
                    <div className="feat-cards">
                        {FEATURES.map(({ icon: Icon, gradient, accent, title, desc, decoration }) => (
                            <div className="feat-card" key={title}>
                                <div className="feat-card-img" style={{ background: gradient }}>
                                    {decoration}
                                    <Icon size={44} color="white" strokeWidth={1.4} className="feat-card-icon" />
                                    <div className="feat-card-glow" style={{ background: accent }} />
                                </div>
                                <div className="feat-card-body">
                                    <p className="feat-card-title">{title}</p>
                                    <p className="feat-card-desc">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Form panel ── */}
            <div className="form-panel">
                <div className="form-card">
                    <div className="form-header">
                        <h1 className="form-title">
                            {isLogin ? "Welcome back" : "Get started"}
                        </h1>
                        <p className="form-subtitle">
                            {isLogin ? "Sign in to your account to continue" : "Create your free account today"}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="form-body" autoComplete="off">
                        {!isLogin && (
                            <div className="field-group">
                                <label className="field-label">Email address</label>
                                <input
                                    className={`field-input ${wrongRegister.email ? "field-error" : ""}`}
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                {wrongRegister.email && <span className="error-msg">{wrongRegister.email[0]}</span>}
                            </div>
                        )}

                        <div className="field-group">
                            <label className="field-label">Username</label>
                            <input
                                className={`field-input ${wrongRegister.username ? "field-error" : ""}`}
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            {wrongRegister.username && <span className="error-msg">{wrongRegister.username[0]}</span>}
                        </div>

                        <div className="field-group">
                            <label className="field-label">Password</label>
                            <input
                                className={`field-input ${wrongRegister.password ? "field-error" : ""}`}
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                                required
                            />
                            {wrongRegister.password && <span className="error-msg">{wrongRegister.password[0]}</span>}
                        </div>

                        {!isLogin && (
                            <div className="field-group">
                                <label className="field-label">I am a&hellip;</label>
                                <div className="role-toggle">
                                    <button type="button"
                                        className={`role-btn ${userType === "organization" ? "role-btn--active" : ""}`}
                                        onClick={() => setUserType("organization")}>
                                        🏫 Organisation
                                    </button>
                                    <button type="button"
                                        className={`role-btn ${userType === "vendor" ? "role-btn--active" : ""}`}
                                        onClick={() => setUserType("vendor")}>
                                        🛍️ Vendor
                                    </button>
                                </div>
                            </div>
                        )}

                        {wrongLogin && (
                            <div className="login-error">
                                Incorrect username or password. Please try again.
                            </div>
                        )}

                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading
                                ? <span className="btn-loader" />
                                : isLogin ? "Sign in" : "Create account"
                            }
                        </button>
                    </form>

                    <p className="form-footer">
                        {isLogin
                            ? <>Don't have an account?{" "}<Link to="/register" className="form-link">Register here</Link></>
                            : <>Already have an account?{" "}<Link to="/login" className="form-link">Sign in</Link></>
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Form;

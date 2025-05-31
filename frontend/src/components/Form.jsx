import {useState} from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import '../styles/form.css';

const Form = ({route, method}) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [userType, setUserType] = useState("Organization")
    const [wrongRegister, setWrongRegister] = useState({})
    const [wrongLogin, setWrongLogin] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const name = method === "login" ? "Login" : "Register"

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        console.log("Requesting:", route);
        console.log("Requesting Full URL:", api.defaults.baseURL + route);

        try {
            const info = {username, password}

            if (method !== 'login') {
                info.user_type = userType
                info.email = email
            }

            console.log("Sending info:", info);
            const res = await api.post(route, info)
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
                navigate("/")
            } else {
                navigate("/login")
            }
        } catch (error) {
            console.log(error)
            if (method === "login") {
                setWrongLogin(true);
            } else if (method === "register") {
                setWrongRegister(error.response.data);
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className="center-container">
                <form onSubmit={handleSubmit} className="form-container">
                    <h1>{name}</h1> 
                    <input
                        className="form-input"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                    />
                    
                    <input
                        className="form-input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                    {method === "register" && (
                        <>
                            <select
                                className="form-input"
                                value={userType}
                                onChange={(e) => setUserType(e.target.value)}
                                required
                            >
                                <option value="Organization">I am an organization!</option>
                                <option value="Vendor">I am a vendor!</option>
                            </select>

                            <input
                                className="form-input"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                            />
                        </>
                    )}
                    <button className="form-button" type="submit">
                        {name}
                    </button>
                    {wrongLogin && 
                        <div className="wrong-info">
                            Incorrect username or password!
                        </div>
                    }
                    {Object.keys(wrongRegister).length > 0 && 
                        <div className="wrong-info">
                            {Object.values(wrongRegister)[0]?.[0]}
                        </div>
                    }
                </form>
            </div>
        </>
    )
    
}

export default Form
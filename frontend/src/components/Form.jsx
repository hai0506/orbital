import {useState} from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

const Form = ({route, method}) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [userType, setUserType] = useState("Organization")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const name = method === "login" ? "Login" : "Register"

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const info = {username, password}

            if (method !== 'login') {
                info.user_type = userType === 'Vendor'
            }

            const res = await api.post(route, info)
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
                navigate("/")
            } else {
                navigate("/login")
            }
        } catch (error) {
            alert(error)
        } finally {
            setLoading(false)
        }
    }

    return <form onSubmit={handleSubmit} className="form-container">
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
                <select
                    className="form-input"
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    required
                >
                    <option value="Organization">I am an organization!</option>
                    <option value="Vendor">I am a vendor!</option>
                </select>
            )}
            <button className="form-button" type="submit">
                {name}
            </button>
        </form>
    
}

export default Form
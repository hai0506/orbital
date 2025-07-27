import {useState} from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import '../styles/Form.css';
import PV from "../styles/PV.png"

const Form = ({route, method}) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
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
                localStorage.setItem("username", username)

                try {
                    const profileRes = await api.get("core/user/profile/");
                    const role = profileRes.data.role;
                    localStorage.setItem("ROLE", role);  
                } catch (err) {
                    console.error("Failed to fetch user profile after login:", err);
                }

                navigate("/")
                console.log("Going home")
            } else {
                navigate("/login")
            }
        } catch (error) {
            console.log(error)
            if (method === "login") {
                setWrongLogin(true);
                console.log("login failed")
            } else if (method === "register") {
                console.log("register failed")
                setWrongRegister(error.response.data);
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="center-container" autoComplete="off">
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        alt="Your Company"
                        src={PV}
                        className="mx-auto max-w-[350px] h-auto block mb-2"
                    />
                    <h2 className="mt-1 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        {
                        method === "register" 
                            ? "Register your account"
                            : "Sign in to your account"
                        }
                    </h2>
                </div>
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="space-y-6">
                    {method === "register" && (
                        <div>
                            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email" 
                                    required
                                    autoComplete="email"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                            {wrongRegister.email && (
                                <p className="mt-1 text-sm text-red-600">
                                    {wrongRegister.email[0]}
                                </p>
                            )}
                        </div>
                    )}

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                            Username
                            </label>
                        </div>
                        <div className="mt-2">
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                        {wrongRegister.username && (
                            <p className="mt-1 text-sm text-red-600">
                                {wrongRegister.username[0]}
                            </p>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                            Password
                            </label>
                            <div className="text-sm">
                            {/*method === "login" && (
                                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                    Forgot password?
                                </a>
                            )*/}
                            </div>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                        {wrongRegister.password && (
                            <p className="mt-1 text-sm text-red-600">
                                {wrongRegister.password[0]}
                            </p>
                        )}
                    </div>

                    {method === "register" && (
                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="user-type" className="block text-sm/6 font-medium text-gray-900">
                                Are you an organization or vendor?
                                </label>
                            </div>

                            <div className="mt-2">
                                <select
                                    id="user-type"
                                    name="user-type"
                                    value={userType}
                                    onChange={(e) => setUserType(e.target.value)}
                                    required
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                >
                                {["Organization", "Vendor"].map((item) => (
                                    <option key={item} value={item}>
                                    {item}
                                    </option>
                                ))}
                                </select>
                            </div>
                        </div>
                    )}

                    <div>
                    <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        {method === "register" ? "Register" : "Sign in"}
                    </button>
                    {wrongLogin && (
                    <p className="mt-1 text-sm text-red-600">
                        Incorrect username and/or password!
                    </p>
                )}
                    </div>
                </div>

                {method === "register"
                     ?   (<p className="mt-10 text-center text-sm/6 text-gray-500">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                Sign in.
                            </Link>
                        </p>)

                     :   (<p className="mt-10 text-center text-sm/6 text-gray-500">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                Register.
                            </Link>
                        </p>)
                }
                </div>
            </div>
        </form>
    )
}

export default Form;
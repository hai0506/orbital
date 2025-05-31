import {useState} from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import '../styles/form.css';
import {
  Button,
  Field,
  Fieldset,
  For,
  Input,
  NativeSelect,
  Stack,
} from "@chakra-ui/react"

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
                navigate("/")
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
            <Fieldset.Root size="lg" maxW="md" invalid={wrongLogin || Object.keys(wrongRegister).length > 0}>
                <Stack>
                    <Fieldset.Legend>{name}</Fieldset.Legend>
                    <Fieldset.HelperText>
                        {
                            method === "register" 
                                ? "Please provide your details below."
                                : "Please key in your credentials."
                        }
                    </Fieldset.HelperText>
                </Stack>

                <Fieldset.Content>
                    <Field.Root>
                        <Field.Label>Username</Field.Label>
                        <Input 
                            name="username"   
                            type="text"
                            autoComplete="off"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                        />
                    </Field.Root>

                    <Field.Root>
                        <Field.Label>Password</Field.Label>
                        <Input 
                            name="password"   
                            type="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                        />
                    </Field.Root>

                    {method === "register" && (
                        <>
                            {/*
                                <Field.Root>
                                <Field.Label>Confirm Password</Field.Label>
                                <Input 
                                    name="confirm-password"   
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm Password"
                                />
                                </Field.Root>
                            */}
                            
                            <Field.Root>
                                <Field.Label>Email address</Field.Label>
                                <Input 
                                    name="email" 
                                    className="form-input"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email" 
                                />
                            </Field.Root>

                            <Field.Root>
                                <Field.Label>Are you an organization or vendor?</Field.Label>
                                <NativeSelect.Root>
                                    <NativeSelect.Field 
                                        name="user-type"
                                        className="form-input"
                                        value={userType}
                                        onChange={(e) => setUserType(e.target.value)}
                                    >
                                    <For each={["Organization", "Vendor"]}>
                                        {(item) => (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                        )}
                                    </For>
                                    </NativeSelect.Field>
                                    <NativeSelect.Indicator />
                                </NativeSelect.Root>
                            </Field.Root>
                        </>
                    )}
                    {(wrongLogin || Object.keys(wrongRegister).length > 0) && (
                        <Fieldset.ErrorText>
                            {wrongLogin
                                ? "Incorrect username or password!"
                                : Object.values(wrongRegister)[0]?.[0]
                            }
                        </Fieldset.ErrorText>
                    )}
                </Fieldset.Content>

                <Button type="submit" alignSelf="flex-start">
                    {name}
                </Button>

                {method === "login"
                    ? <p>
                        Don't have an account? 
                        <Link to="/register" className="link"> Register here</Link>
                      </p>
                    : <p>
                        Already have an account? 
                        <Link to="/login" className="link"> Login here</Link>
                      </p>
                }

            </Fieldset.Root>
        </form>
    )
}

export default Form;
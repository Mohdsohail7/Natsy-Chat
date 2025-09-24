import { Children, createContext, useContext, useEffect, useState } from "react";
import { guestLogin, loginUser, registerUser, logout as logoutApi } from "../../../backend/controllers/authController";



const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // { username, role, token }
    const [loading, setLoading] = useState(true);

    // load user from local storage on app start
    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        const username = localStorage.getItem("username");

        if (token && role && username) {
            setUser({ token, role, username });
        }
        setLoading(false);
    }, []);

    // Guest login
    const loginAsGuest = async (username) => {
        const response = await guestLogin(username);
        setUser({ token: response.token, role: "guest", username: response.username });
        return response;
    };

    // Register user
    const register = async (data) => {
        return await registerUser(data);
    };

    // User login
    const login = async (data) => {
        const response = await loginUser(data);
        setUser({ token: response.token, role: "user", username: response.username });
        return response;
    };

    // Logout
    const logout = async () => {
        await logoutApi();
        setUser(null);
    };

    return(
        <AuthContext.Provider
            value={{ user, loading, loginAsGuest, register, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => useContext(AuthContext);
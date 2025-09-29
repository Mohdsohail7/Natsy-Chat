import { createContext, useContext, useEffect, useState } from "react";
import { guestLogin, loginUser, registerUser, logout as logoutApi } from "../api/auth";



const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // { username, role, token }
    const [loading, setLoading] = useState(true);
    const [hasRandomChat, setHasRandomChat] = useState(false);

    // load user from local storage on app start
    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        const username = localStorage.getItem("username");
        const random = localStorage.getItem("hasRandomChat"); // restore flag

        if (token && role && username) {
            setUser({ token, role, username });
            setHasRandomChat(random === "true"); // restore previous randomChat state
        }
        setLoading(false);
    }, []);

    // Guest login
    const loginAsGuest = async (username) => {
        const response = await guestLogin(username);
        setUser({ token: response.token, role: "guest", username: response.username });
        setHasRandomChat(true);
        
        localStorage.setItem("token", response.token);
        localStorage.setItem("role", "guest");
        localStorage.setItem("username", response.username);
        localStorage.setItem("refId", response.sessionId);
        localStorage.setItem("hasRandomChat", "true");

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

        localStorage.setItem("token", response.token);
        localStorage.setItem("role", "user");
        localStorage.setItem("username", response.username);

        // if they already had Random Chat, keep it
        if (localStorage.getItem("hasRandomChat") === "true") {
            setHasRandomChat(true);
        } else {
            setHasRandomChat(false);
        }
        return response;
    };

    // Logout
    const logout = async () => {
        await logoutApi();
        setUser(null);
        setHasRandomChat(false);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        localStorage.removeItem("hasRandomChat");
    };

    return(
        <AuthContext.Provider
            value={{ user, loading, loginAsGuest, register, login, logout, hasRandomChat }}
        >
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => useContext(AuthContext);
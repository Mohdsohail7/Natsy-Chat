import {axiosInstance} from "./apiConnector";

// Guest login
export const guestLogin = async (username) => {
    const { data } = await axiosInstance.post("/auth/guest-login", { username });
    // save to localstorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", "guest");
    localStorage.setItem("username", data.username);
    localStorage.setItem("refId", data.sessionId);
    
    return data;
};

// User register
export const registerUser = async ({ username, email, password }) => {
    const { data } = await axiosInstance.post("/auth/register", {
        username,
        email,
        password,
    });
    return data // verification link will come here
};

// User login
export const loginUser = async ({ username, password }) => {
    const { data } = await axiosInstance.post("/auth/login", { username, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", "user");
    localStorage.setItem("username", data.username);
    return data;
};

// Email Verification
export const verifyEmail = async (token) => {
  const { data } = await axiosInstance.get(`/auth/verify/${token}`, {
    params: { redirect: false },
  });
  return data;
};

// Resend verification email
export const resendVerification = async (email) => {
  const { data } = await axiosInstance.post("/auth/resend-verification", { email });
  return data;
};

// Logout
export const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    return true;
}
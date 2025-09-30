import {axiosInstance} from "./apiConnector";

// Guest login
export const guestLogin = async (username) => {
    const { data } = await axiosInstance.post("/auth/guest-login", { username });
    return data;
};

// User register
export const registerUser = async ({ email, password, guestSessionId }) => {
    const { data } = await axiosInstance.post("/auth/register", {
        email,
        password,
        guestSessionId 
    });
    return data // verification link will come here
};

// User login
export const loginUser = async ({ username, password }) => {
    const { data } = await axiosInstance.post("/auth/login", { username, password });
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
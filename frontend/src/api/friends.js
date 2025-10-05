import { axiosInstance } from "./apiConnector"

// Send friend request
export const sendFriendRequest = async (toUsername) => {
    const { data } = await axiosInstance.post("/friends/send-request", { toUsername });
    return data;
};

// Respond to a friend request (accept/reject)
export const responseFriendRequest = async (requestId, action) => {
    const { data } = await axiosInstance.post("/friends/send-response", { requestId, action });
    return data;
}


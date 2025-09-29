import { axiosInstance } from "./apiConnector"



// Send friend request
export const sendFriendRequest = async (receiverId) => {
    const { data } = await axiosInstance.post("/friends/send-request", { receiverId });
    return data;
};

// Respond to a friend request (accept/reject)
export const responseFriendRequest = async (requestId, action) => {
    const { data } = await axiosInstance.post("/friends/respond-request", { requestId, action });
    return data;
}


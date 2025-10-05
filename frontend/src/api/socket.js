import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:4000", {
    withCredentials: true,
    auth: (cb) => {
    const token = localStorage.getItem("token");
    cb({ token }); // send { token } to server on connection
  },
});

export default socket;
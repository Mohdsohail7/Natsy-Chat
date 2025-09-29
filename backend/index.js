const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");
const chatSocket = require("./sockets/chatSocket");

require("dotenv").config();

const app = express();
const server = http.createServer(app);

// Socket.IO setup with CORS for frontend
const io = new Server(server, {
    cors: { 
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true
     },
});

// attach io to app for controller usage
app.set("io",io);

// Enable CORS for HTTP requests from frontend
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}));

// middleware
app.use(express.json());


// Routes
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const friendRequestRoutes = require("./routes/friendRoutes");


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/friend", friendRequestRoutes);

// sockets
chatSocket(io)


// default route
app.get("/", (req, res) => {
    return res.status(200).json({ message: "Natsy Chat is Running..."});
});

// servr listen on port 4000 with database connection 
const port = process.env.PORT || 4000;
connectDB().then(() => {
    server.listen(port, () => {
        console.log(`Server is Running at port: ${port}`);
    })
})
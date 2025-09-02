const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


// default route
app.get("/", (req, res) => {
    return res.status(200).json({ message: "Natsy Chat is Running..."});
});

// servr listen on port 4000 with database connection 
const port = process.env.PORT || 4000;
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is Running at port: ${port}`);
    })
})
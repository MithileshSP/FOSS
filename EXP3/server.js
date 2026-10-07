const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { createClient } = require("redis");
const cors = require("cors");

require("dotenv").config();

const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on("error", (err) => {
    console.log("Redis Error:", err);
});

async function startServer() {

    await redisClient.connect();

    console.log("Redis connected successfully");

    // Socket.IO connection
    io.on("connection", (socket) => {

        console.log("User connected:", socket.id);

        socket.on("registerUser", (userId) => {

            socket.join(`user_${userId}`);

            console.log(`User ${userId} registered`);
        });

        socket.on("disconnect", () => {

            console.log(
                "User disconnected:",
                socket.id
            );

        });

    });

    // Notification API
    app.use(
        "/api/notifications",
        notificationRoutes(redisClient, io)
    );

    server.listen(process.env.PORT, () => {

        console.log(
            `Server running at http://localhost:${process.env.PORT}`
        );

    });
}

startServer();
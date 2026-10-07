const express = require("express");

const {
    createNotification
} = require("../services/notificationService");

function notificationRoutes(redisClient, io) {

    const router = express.Router();

    router.post("/", async (req, res) => {

        try {

            const { userId, message, type } = req.body;

            const notification = await createNotification(
                redisClient,
                io,
                {
                    userId,
                    message,
                    type
                }
            );

            res.json({
                success: true,
                notification
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                error: error.message
            });

        }

    });

    return router;
}

module.exports = notificationRoutes;
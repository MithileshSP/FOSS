async function createNotification(redisClient, io, notification) {

    const { userId, message, type } = notification;

    const newNotification = {
        userId,
        message,
        type,
        timestamp: new Date().toISOString()
    };

    // Store notification in Redis
    await redisClient.lPush(
        `notifications:${userId}`,
        JSON.stringify(newNotification)
    );

    // Send notification to connected user
    io.to(`user_${userId}`).emit(
        "notification",
        newNotification
    );

    return newNotification;
}

module.exports = {
    createNotification
};
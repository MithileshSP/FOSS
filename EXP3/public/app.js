const socket = io();

const userId = "101";

// Register user with Socket.IO
socket.emit("registerUser", userId);

// Receive real-time notification
socket.on("notification", (notification) => {

    const div = document.createElement("div");

    div.innerHTML = `
        <p>
            <strong>${notification.type}</strong>:
            ${notification.message}
        </p>
    `;

    document
        .getElementById("notifications")
        .prepend(div);
});
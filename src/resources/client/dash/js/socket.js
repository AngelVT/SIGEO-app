const socket = io("/", {
    transports: ["websocket"],
    withCredentials: true
});
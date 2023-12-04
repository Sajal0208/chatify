"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPeerServerListeners = void 0;
const createPeerServerListeners = (peerServer) => {
    peerServer.on("connection", (client) => {
        console.log(client);
        console.log(`Client connected ${client.id}`);
    });
    peerServer.on("disconnect", (client) => {
        console.log(`Client disconnected ${client.id}`);
    });
};
exports.createPeerServerListeners = createPeerServerListeners;
//# sourceMappingURL=groupcall.js.map
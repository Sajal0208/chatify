import { TPeerServer } from ".";

export const createPeerServerListeners = (peerServer: TPeerServer) => {
    peerServer.on("connection", (client: any) => {
        console.log(client);
        console.log(`Client connected ${client.id}`);
    });
    
    peerServer.on("disconnect", (client: any) => {
        console.log(`Client disconnected ${client.id}`);
    });
};

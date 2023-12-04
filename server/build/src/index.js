"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const db_1 = __importDefault(require("./db"));
const peer_1 = require("peer");
const groupCallHandler = __importStar(require("./groupcall"));
const uuid = __importStar(require("uuid"));
const PORT = process.env.PORT || 8080;
const app = (0, express_1.default)();
const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
const peerServer = (0, peer_1.ExpressPeerServer)(server, {});
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
    },
});
groupCallHandler.createPeerServerListeners(peerServer);
app.use("/peerjs", peerServer);
const broadcastEventTypes = {
    ACTIVE_USERS: "ACTIVE_USERS",
    GROUP_CALL_ROOMS: "GROUP_CALL_ROOMS",
};
// const allowedOrigins = ["http://localhost:3000"];
// const options: cors.CorsOptions = {
//   origin: allowedOrigins,
// };
// Then pass these options to cors:
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
io.on("connection", (socket) => {
    socket.emit("connection", null);
    console.log("a user connected");
    console.log(socket.id);
    socket.on("register-new-user", (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { username, socketId } = data;
        console.log(username, socketId);
        try {
            const newUser = yield db_1.default.user.create({
                data: {
                    username: username,
                    socketId: socketId,
                },
            });
            console.log(newUser);
        }
        catch (e) {
            console.log(e);
        }
        io.sockets.emit("broadcast", {
            event: broadcastEventTypes.ACTIVE_USERS,
            activeUsers: yield getActiveUsers(),
        });
        io.sockets.emit("broadcast", {
            event: broadcastEventTypes.GROUP_CALL_ROOMS,
            groupCallRooms: yield getAllRooms(),
        });
    }));
    socket.on("disconnect", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("user disconnected", socket.id);
        try {
            const deletedUser = yield db_1.default.user.delete({
                where: {
                    socketId: socket.id,
                },
            });
            console.log("userDeleted" + deletedUser);
        }
        catch (e) {
            console.log(e);
        }
        const groupCallRooms = yield getAllRooms();
        const newGroupCallRoom = groupCallRooms === null || groupCallRooms === void 0 ? void 0 : groupCallRooms.filter((room) => room.socketId !== socket.id);
        io.sockets.emit("broadcast", {
            event: broadcastEventTypes.GROUP_CALL_ROOMS,
            groupCallRooms: newGroupCallRoom,
        });
    }));
    socket.on("pre-offer", (data) => {
        console.log("pre-offer received");
        io.to(data.callee.socketId).emit("pre-offer", {
            callerUsername: data.caller.username,
            callerSocketId: socket.id,
        });
    });
    socket.on("pre-offer-answer", (data) => {
        console.log("handling pre-offer-answer");
        io.to(data.callerSocketId).emit("pre-offer-answer", {
            answer: data.answer,
        });
    });
    socket.on("webRTC-offer", (data) => {
        console.log("handling webRTC-offer");
        io.to(data.calleeSocketId).emit("webRTC-offer", {
            offer: data.offer,
        });
    });
    socket.on("webRTC-answer", (data) => {
        console.log("handling webRTC-answer");
        io.to(data.callerSocketId).emit("webRTC-answer", {
            answer: data.answer,
        });
    });
    socket.on("webRTC-candidate", (data) => {
        console.log("handling ice candidate");
        io.to(data.connectedUserSocketId).emit("webRTC-candidate", {
            candidate: data.candidate,
        });
    });
    socket.on("user-hanged-up", (data) => {
        console.log("handling user hanged up");
        io.to(data.connectedUserSocketId).emit("user-hanged-up");
    });
    // Listeners related to group calls
    socket.on("group-call-register", (data) => __awaiter(void 0, void 0, void 0, function* () {
        const roomId = uuid.v4();
        socket.join(roomId);
        const newGroupCallRoom = {
            peerId: data.peerId,
            hostName: data.username,
            socketId: socket.id,
            roomId: roomId,
        };
        const newRoom = yield db_1.default.room.create({
            data: newGroupCallRoom,
        });
        const groupCallRooms = yield getAllRooms();
        io.sockets.emit("broadcast", {
            event: broadcastEventTypes.GROUP_CALL_ROOMS,
            groupCallRooms,
        });
    }));
    socket.on("group-call-join-request", (data) => {
        io.to(data.roomId).emit("group-call-join-request", {
            peerId: data.peerId,
            streamId: data.streamId,
        });
        socket.join(data.roomId);
    });
    socket.on("group-call-user-left", (data) => {
        socket.leave(data.roomId);
        io.to(data.roomId).emit("group-call-user-left", {
            streamId: data.streamId,
        });
    });
    socket.on("group-call-closed", (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const deletedRoom = yield db_1.default.room.deleteMany({
                where: {
                    peerId: data.peerId,
                },
            });
            const groupCallRooms = yield getAllRooms();
            io.sockets.emit("broadcast", {
                event: broadcastEventTypes.GROUP_CALL_ROOMS,
                groupCallRooms,
            });
        }
        catch (e) {
            console.log(e);
        }
    }));
});
function getAllRooms() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const rooms = yield db_1.default.room.findMany({});
            return rooms;
        }
        catch (e) {
            console.log(e);
            return null;
        }
    });
}
function getActiveUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield db_1.default.user.findMany({});
            return user;
        }
        catch (e) {
            console.log(e);
            return null;
        }
    });
}
function getUser({ username }) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield db_1.default.user.findUnique({
            where: {
                username: username,
            },
        });
        return user;
    });
}
app.get("/isUserExists", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.query.username;
    try {
        const user = yield getUser({ username });
        if (!user) {
            return res.status(200).send({
                isExists: false,
                message: "User not found",
            });
        }
        return res.status(200).send({
            isExists: true,
            message: "User found",
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send({
            isExists: false,
            message: "Something went wrong",
        });
    }
}));
//# sourceMappingURL=index.js.map
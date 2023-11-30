import cors from "cors";
import { Request, Response } from "express";
import { Server } from "socket.io";
import express from "express";
import http from "http";
import bodyParser from "body-parser";
import prisma from "./db";
import { ExpressPeerServer, PeerServerEvents } from "peer";
import * as groupCallHandler from "./groupcall";
import * as uuid from "uuid";
import { Room, User } from "@prisma/client";

const PORT = process.env.PORT || 8080;
const app = express();
const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
})
export type TPeerServer = express.Express & PeerServerEvents;
const peerServer: TPeerServer = ExpressPeerServer(server, {});
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

groupCallHandler.createPeerServerListeners(peerServer);

app.use('/peerjs', peerServer);
const broadcastEventTypes = {
  ACTIVE_USERS: "ACTIVE_USERS",
  GROUP_CALL_ROOMS: "GROUP_CALL_ROOMS",
}

// const allowedOrigins = ["http://localhost:3000"];
// const options: cors.CorsOptions = {
//   origin: allowedOrigins,
// };

// Then pass these options to cors:
app.use(cors());
app.use(bodyParser.json());

io.on("connection", (socket) => {
  socket.emit("connection", null);
  console.log("a user connected");
  console.log(socket.id);

  socket.on("register-new-user", async (data) => {
    const { username, socketId } = data;
    console.log(username, socketId)
    try {
      const newUser = await prisma.user.create({
        data: {
          username: username,
          socketId: socketId,
        } ,
      });
      console.log(newUser);
    } catch (e) {
      console.log(e);
    }

    io.sockets.emit('broadcast', {
      event: broadcastEventTypes.ACTIVE_USERS,
      activeUsers: await getActiveUsers()
    })
    io.sockets.emit('broadcast', {
      event: broadcastEventTypes.GROUP_CALL_ROOMS,
      groupCallRooms: await getAllRooms(),
    })
  });

  socket.on('disconnect', async () => {
    console.log("user disconnected", socket.id);
    try {
      const deletedUser = await prisma.user.delete({
        where: {
          socketId: socket.id,
        },
      });
      console.log("userDeleted" + deletedUser);
    } catch (e) {
      console.log(e);
    }

    const groupCallRooms = await getAllRooms();
    const newGroupCallRoom = groupCallRooms?.filter((
      (room:Room) => room.socketId !== socket.id 
    ))
    io.sockets.emit('broadcast', {
      event: broadcastEventTypes.GROUP_CALL_ROOMS,
      groupCallRooms: newGroupCallRoom
    })
  })

  socket.on('pre-offer', (data) => {
    console.log('pre-offer received');
    io.to(data.callee.socketId).emit('pre-offer', {
      callerUsername: data.caller.username,
      callerSocketId: socket.id
    })
  })

  socket.on('pre-offer-answer', (data) => {
    console.log('handling pre-offer-answer')
    io.to(data.callerSocketId).emit('pre-offer-answer', {
      answer: data.answer
    })
  })

  socket.on('webRTC-offer', (data) => {
    console.log('handling webRTC-offer')
    io.to(data.calleeSocketId).emit('webRTC-offer', {
      offer: data.offer
    })
  })

  socket.on('webRTC-answer', (data) => {
    console.log('handling webRTC-answer')
    io.to(data.callerSocketId).emit('webRTC-answer', {
      answer: data.answer
    })
  })

  socket.on('webRTC-candidate', (data) => {
    console.log('handling ice candidate')
    io.to(data.connectedUserSocketId).emit('webRTC-candidate', {
      candidate: data.candidate
    })
  })

  socket.on('user-hanged-up', (data) => {
    console.log('handling user hanged up')
    io.to(data.connectedUserSocketId).emit('user-hanged-up')
  })

  // Listeners related to group calls
  socket.on('group-call-register', async (data) => {
    const roomId = uuid.v4();
    socket.join(roomId);

    const newGroupCallRoom = {
      peerId: data.peerId,
      hostName: data.username,
      socketId: socket.id,
      roomId: roomId
    }

    const newRoom = await prisma.room.create({
      data: newGroupCallRoom
    })

    const groupCallRooms = await getAllRooms();
    io.sockets.emit('broadcast', {
      event: broadcastEventTypes.GROUP_CALL_ROOMS,
      groupCallRooms
    })
  })


  socket.on('group-call-join-request', (data) => {
    io.to(data.roomId).emit('group-call-join-request', {
      peerId: data.peerId,
      streamId: data.streamId,
    })

    socket.join(data.roomId)
  })

  socket.on('group-call-user-left', (data) => {
    socket.leave(data.roomId)
    io.to(data.roomId).emit('group-call-user-left', {
      streamId: data.streamId
    })
  })

  socket.on('group-call-closed', async (data) => {
    try {
      const deletedRoom = await prisma.room.deleteMany({
        where: {
          peerId: data.peerId
        }
      })

      const groupCallRooms = await getAllRooms();
      io.sockets.emit('broadcast', {
        event: broadcastEventTypes.GROUP_CALL_ROOMS,
        groupCallRooms
      })
    } catch (e) {
      console.log(e)
    }
  })
});

async function getAllRooms () {
  try {
    const rooms = await prisma.room.findMany({})
    return rooms
  } catch (e) {
    console.log(e)
    return null
  }
}

async function getActiveUsers() {
  try {
    const user = await prisma.user.findMany({});
    return user;
  } catch (e) {
    console.log(e)
    return null
  }
}

async function getUser({ username }: { username: string }) {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  return user;
}

app.get("/isUserExists", async (req: Request, res: Response) => {
  const username = req.query.username as string;
  try {
    const user = await getUser({ username });
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
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      isExists: false,
      message: "Something went wrong",
    });
  }
});
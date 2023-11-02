import cors from "cors";
import { Request, Response } from "express";
import type { Socket } from "socket.io";
import { Server } from "socket.io";
import express from "express";
import http from "http";
import bodyParser from "body-parser";
import prisma from "./db";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const broadcastEventTypes = {
  ACTIVE_USERS: "ACTIVE_USERS",
  GROUP_CALL_ROOMS: "GROUP_CALL_ROOMS",
}

const allowedOrigins = ["http://localhost:3000"];
const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

// Then pass these options to cors:
app.use(cors(options));
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
        },
      });
      console.log(newUser);
    } catch (e) {
      console.log(e);
    }

    io.sockets.emit('broadcast', {
      event: broadcastEventTypes.ACTIVE_USERS,
      activeUsers: await getActiveUsers()
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
});

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

server.listen(8080, () => {
  console.log("Chat listening on port 8080");
});

app.listen(8000, () => {
  console.log("Listening on port 8000");
});

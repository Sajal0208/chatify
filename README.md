
# Chatify

Welcome to Chatify, a powerful video-calling application designed to offer users a seamless and immersive real-time communication experience. Leveraging raw WebRTC implementation, this application allows users to connect through high-quality video calls and engage in text-based chat interactions within the same platform. Elevate your communication experience with PeerConnect, where connecting with others is not just a call, but an immersive conversation.








## Features

1. Seamless Video Calls
Immerse yourself in high-quality, seamless video calls with PeerConnect. Our application harnesses raw WebRTC implementation to ensure crystal-clear and real-time communication.

2. Integrated Text-Based Chat
Enhance your communication experience by seamlessly transitioning between video calls and text-based chat interactions within the same application. Stay connected and engage with your peers effortlessly.

3. User-Friendly Interface
PeerConnect is designed with a user-friendly interface, making it easy for users to navigate and enjoy a hassle-free communication experience. Connect with others effortlessly and focus on what matters most—your conversation.




## Tech Stack

- 💻 [Typescript](https://www.typescriptlang.org/)
- 🚀 [React.js](https://nextjs.org/)
- 🔒 [NodeJs](https://next-auth.js.org/)
- 🎨 [TailwindCSS](https://tailwindcss.com/)
- 📚 [Prisma](https://prisma.io/)
-  🐳 [Docker](https://docker.com/)


## Run Locally Without Docker Compose

Clone the project

```bash
  git clone git@github.com:Sajal0208/chatify.git
```

Go to the project directory

```bash
  cd chatify
```

Install dependencies

```bash
  cd client 
  npm install
  cd ../server
  npm install
```

Use Docker to boot-up postgres locally,
In the root directory

```bash
  docker run -e POSTGRES_PASSWORD=secret -e POSTGRES_USER=postgres --name postgresdb -p 5432:5432 postgres
```

Connect Prisma to Local Postgres server

```bash
  npx prisma migrate dev
  npx prisma db push
```

Start the server

```bash
  cd client
  npm start
```

In another terminal,

```bash
  cd server
  npm run local:watch
```

## Run Locally With Docker Compose

Clone the project

```bash
  git clone git@github.com:Sajal0208/chatify.git
```

Go to the project directory,

```bash
  cd chatify
```

In the root directory,

```bash
  docker run -e POSTGRES_PASSWORD=secret -e POSTGRES_USER=postgres --name postgresdb -p 5432:5432 postgres
```

In the root directory,

```bash
  docker compose up -d
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

Client Side: 

```bash 
    cd /chatify/client
    mkdir .env
```
`REACT_APP_BASE_URL = "http://localhost:8080"`

Server Side: 
```bash 
    cd /chatify/server
    mkdir .env
```
`POSTGRES_PASSWORD="secret"`

`POSTGRES_USER="postgres"`

`POSTGRES_DB="chatify"`

`DATABASE_URL="postgresql://postgres:secret@localhost:5432/chatify?schema=public"`

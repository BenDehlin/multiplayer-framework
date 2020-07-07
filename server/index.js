require("dotenv").config({ path: __dirname + "/../.env" })
const express = require("express")
const session = require("express-session")
const massive = require("massive")
const app = express()
const users = []
const rooms = {}

const {
  SERVER_PORT,
  SESSION_SECRET,
  CONNECTION_STRING,
} = process.env

//Controllers
const authCtrl = require("./controllers/authController")
const userCtrl = require("./controllers/userController")
const roomCtrl = require('./controllers/roomController')

//Middleware
const authMid = require("./middleware/authMiddleware")
app.use(express.json())
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
)

//Database connection
massive({
  connectionString: CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
}).then((db) => {
  app.set("db", db)
  app.set('users', users)
  app.set('rooms', rooms)
  console.log("Database connected")
  const io = require("socket.io")(
    app.listen(SERVER_PORT, () =>
      console.log(`Server listening on ${SERVER_PORT}`)
    )
  )
  app.set("io", io)
  //Socket connection
  io.on("connection", (socket) => {
    console.log("User Connected")
    // console.log(socket.id)
    const sockets = io.clients()
    for(let key in sockets.sockets){
      console.log(sockets.sockets[key].conn.id)
    }
    socket.on("join", (body) => userCtrl.join(app, socket, body))
    socket.on('leave', () => userCtrl.leave(app, socket))
    socket.on("disconnect", () => userCtrl.leave(app, socket))
    socket.on('create-room', (body) => roomCtrl.createRoom(app, socket, body))
    socket.on('join-room', (body) => roomCtrl.joinRoom(app, socket, body))
    socket.on('leave-room', (body) => roomCtrl.leaveRoom(app, socket, body))
    socket.on('cancel-room', (body) => roomCtrl.cancelRoom(app, socket, body))
  })
})

//Endpoints
//Auth Endpoints
app.post("/auth/register", authCtrl.register)
app.post("/auth/login", authCtrl.login)
app.post("/auth/logout", authCtrl.logout)
app.get("/auth/user", authMid.usersOnly, authCtrl.getUser)

app.get('/api/rooms', roomCtrl.getAllRooms)

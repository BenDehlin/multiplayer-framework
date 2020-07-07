const {
  removeSocketId,
  removeUserFromList,
  // removeUserChallenges,
  // findChallengeIndex,
  // generateInitialGameState,
  // removeUserFromGame,
} = require("../utils/lobbyUtils")

const getUsers = (req, res) => {
  const users = req.app.get("users")
  res.status(200).send(removeSocketId(users))
}

const join = (app, socket, body) => {
  const io = app.get("io")
  const db = app.get("db")
  const users = app.get("users")
  const foundUser = users.find((e) => e.user_id === body.user_id)
  if (!foundUser) {
    db.rooms.deactivate_rooms(body.user_id).then((rooms) => {
      io.in("userlist").emit("rooms", rooms)
    })
    socket.join("userlist")
    users.push({ ...body, socket_id: socket.id })
    app.set("users", users)
    io.in("userlist").emit("users", removeSocketId(users))
  }
}
const leave = (app, socket) => {
  const db = app.get("db")
  const io = app.get("io")
  const rooms = app.get("rooms")
  console.log("user-disconnected", socket.id)
  const user_id = removeUserFromList(app, socket)
  for (let key in rooms) {
    if (rooms[key].user_id === user_id) {
      io.in(rooms[key].room_id).emit('host-disconnected')
      delete rooms[key]
    }else{
      const newUsers = rooms[key].users.filter((e) => e.user_id !== user_id)
      if (newUsers.length !== rooms[key].users.length) {
        rooms[key].users = newUsers
        io.in(rooms[key].room_id).emit("room", rooms[key])
      }
    }
  }
  app.set("rooms", rooms)
  db.rooms.deactivate_rooms(user_id).then((rooms) => {
    io.in("userlist").emit("rooms", rooms)
  })
  // removeUserChallenges(user_id, app)
  // removeUserFromGame(user_id, app)
}

// const createRoom = (app, socket, {roomName}) => {
//   const {user_id} = app.session.user
//   const io = app.get('io')
//   const db = app.get('db')
//   const [room] = await db.rooms.get_room(user_id)
//   db.rooms.create_room(roomName).then((rooms) => {
//     io.in('userlist').emit('rooms', rooms)
//   })
// }

// const joinRoom = () => {}

// const challenge = (app, body) => {
//   const io = app.get("io")
//   const users = app.get("users")
//   const challenges = app.get("challenges")
//   const { opponent } = body
//   if (findChallengeIndex(challenges, body) === -1) {
//     challenges.push(body)
//     const opponentSocket = users.find((u) => +opponent.user_id === +u.user_id)
//     app.set("challenges", challenges)
//     io.to(opponentSocket.socket_id).emit("send-challenge", body)
//   }
// }
// const acceptChallenge = (app, body) => {
//   const io = app.get("io")
//   const users = app.get("users")
//   const challenges = app.get("challenges")
//   const lobbies = app.get("lobbies")
//   const { challenger, opponent } = body
//   if (findChallengeIndex(challenges, body) !== -1) {
//     lobbies.push({room: `${challenger.user_id}-${opponent.user_id}`, players: [challenger, opponent]} )
//     app.set("lobbies", lobbies)
//     const challengerSocket = users.find(
//       (u) => +challenger.user_id === +u.user_id
//     )
//     const opponentSocket = users.find((u) => +opponent.user_id === +u.user_id)
//     removeUserChallenges(challenger.user_id, app)
//     removeUserChallenges(opponent.user_id, app)
//     generateInitialGameState(io, body, challengerSocket, opponentSocket)
//   }
// }

module.exports = {
  getUsers,
  join,
  leave,
  // challenge,
  // acceptChallenge,
}

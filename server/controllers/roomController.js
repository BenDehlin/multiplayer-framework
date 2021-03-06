const getGameRooms = (app, socket, { game_id }) => {
  const db = app.get("db")
  db.rooms
    .get_game_rooms(game_id)
    .then((rooms) => {
      socket.emit("rooms", { rooms })
    })
    .catch((err) => console.log(err))
}

const getAllRooms = (req, res) => {
  const db = req.app.get("db")
  db.rooms
    .get_rooms()
    .then((rooms) => {
      // console.log(rooms)
      res.status(200).send(rooms)
    })
    .catch((err) => res.status(500).send(err))
}
const joinRoom = async (app, socket, {room_id, user}) => {
  const io = app.get('io')
  const db = app.get('db')
  const rooms = app.get('rooms')
  const room = rooms[room_id]
  if(room){
    socket.join(room.room_id)
    room.users = [...room.users, user]
    rooms[room_id] = room
    app.set('rooms', rooms)
    socket.emit('join-room', room)
    io.in(room_id).emit('room', room)
  }else{
    socket.emit('error', {message: `unable to connect to room ${room_id}`})
  }
}
const leaveRoom = (app, socket, {room_id, user_id}) => {
  const io = app.get('io')
  const rooms = app.get('rooms')
  const newUsers = rooms[room_id].users.filter(e => e.user_id !== user_id)
  rooms[room_id].users = newUsers
  app.set('rooms', rooms)
  socket.leave(room_id)
  io.in(room_id).emit('room', {...rooms[room_id]})
}

const cancelRoom = (app, socket, {room_id, user_id}) => {
  const io = app.get('io')
  const db = app.get('db')
  const rooms = app.get('rooms')
  delete rooms[room_id]
  app.set('rooms', rooms)
  io.in(room_id).emit('host-disconnected')
  db.rooms.deactivate_room(room_id).then(rooms => {
    io.in('user-list').emit('rooms', rooms)
  })
}

const createRoom = async (app, socket, { users, game_id, user_id }) => {
    const io = app.get("io")
    const db = app.get("db")
    const rooms = app.get('rooms')
    const [room] = await db.rooms.get_room(user_id, game_id)
    if (room) {
      db.rooms
        .activate_room(room.room_id)
        .then(([room]) => {
          rooms[room.room_id] = {...room, users}
          console.log(rooms)
          app.set('rooms', rooms)
          socket.join(room.room_id)
          socket.emit("create-room", { ...room, users })
          db.rooms.get_rooms().then((rooms) => {
            console.log('inside if', rooms)
            io.in("userlist").emit("rooms", rooms)
          }).catch(err => console.log(err))
        })
        .catch((err) => console.log(err))
    } else {
      db.rooms
        .create_room(user_id, game_id)
        .then(([room]) => {
          rooms[room.room_id] = {...room, users}
          app.set('rooms', rooms)
          socket.emit("create-room", { ...room, users })
          db.rooms
            .get_rooms()
            .then((rooms) => {
              console.log('inside else', rooms)
              io.in("userlist").emit("rooms", rooms)
            })
            .catch((err) => console.log(err))
        })
        .catch((err) => console.log(err))
    }
}

const startGame = async (app, socket, {players, room_id}) => {
  const io = app.get('io')
  const db = app.get('db')
  const state= {
    gameStart: true,
    players
  }
  //remove room from joinable rooms
  //create initial game state and send to all players in room
  io.in(room_id).emit('game-start', state)
}

module.exports = {
  getGameRooms,
  getAllRooms,
  createRoom,
  joinRoom,
  cancelRoom,
  leaveRoom,
  startGame
}

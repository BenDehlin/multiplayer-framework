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
      res.status(200).send(rooms)
    })
    .catch((err) => res.status(500).send(err))
}
const joinRoom = async (app, socket, {room_id, game_id, user}) => {
  const io = app.get('io')
  const db = app.get('db')
  const [room] = await db.rooms.check_room_active(room_id)
  if(room){
    socket.join(room.room_id)
    socket.emit('join-room', {room})
    io.in(room_id).emit('new-user', {user})
  }else{
    socket.emit('error', {message: `unable to connect to room ${room_id}`})
  }
}
const leaveRoom = () => {}

const createRoom = async (app, socket, { game_id, user_id }) => {
  // const { user_id } = app.session.user && app.session.user
    const io = app.get("io")
    const db = app.get("db")
    const [room] = await db.rooms.get_room(user_id, game_id)
    console.log(room)
    if (room) {
      db.rooms
        .activate_room(room.room_id)
        .then(([room]) => {
          // console.log(room)
          socket.join(room.room_id)
          socket.emit("create-room", { room })
          db.rooms.get_rooms().then((rooms) => {
            // console.log(rooms)
            io.in("userlist").emit("rooms", rooms)
          }).catch(err => console.log(err))
        })
        .catch((err) => console.log(err))
    } else {
      // console.log('hit')
      // console.log({user_id})
      // console.log({game_id})
      db.rooms
        .create_room(user_id, game_id)
        .then(([room]) => {
          socket.emit("create-room", { room })
          db.rooms
            .get_rooms()
            .then((rooms) => {
              console.log({rooms})
              io.in("userlist").emit("rooms", rooms)
            })
            .catch((err) => console.log(err))
        })
        .catch((err) => console.log(err))
    }
}

const hostLeaveRoom = (app, { room_id }) => {
  const db = app.get("db")
  db.rooms.deactivate_room(room_id).then((rooms) => {
    io.in("userlist").emit("rooms", rooms)
  })
}

module.exports = {
  getGameRooms,
  getAllRooms,
  createRoom,
  joinRoom,
  hostLeaveRoom,
}

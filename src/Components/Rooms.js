import React, { useState, useEffect, useContext } from "react"
import { UserContext } from "../context/UserContext"
import axios from "axios"

const Rooms = () => {
  const { socket, user, room, setRoom } = useContext(UserContext)
  const [rooms, setRooms] = useState([])
  useEffect(() => {
    axios.get("/api/rooms").then(({ data }) => setRooms(data))
  }, [])
  useEffect(() => {
    socket.on("create-room", (body) => {
      console.log("hit create")
      console.log(body)
      setRoom({ ...body, users: [user] })
    })
    socket.on("rooms", (body) => {
      console.log("hit rooms")
      console.log(body)
      setRooms(body)
    })
    socket.on("join-room", (room) => {
      console.log(room)
      setRoom(room)
    })
  }, [])
  const joinRoom = (room_id) => {
    socket.emit("join-room", { room_id, user })
  }
  return (
    <div>
      <h1>Rooms:</h1>
      <div>
        {rooms.map((e) => {
          return (
            <div key={e.room_id}>
              <div>{e.room_id}</div>
              <div>Game: {e.game_name}</div>
              <button onClick={() => joinRoom(e.room_id)}>Join Room</button>
            </div>
          )
        })}
      </div>
      <button
        onClick={() =>
          socket.emit("create-room", {
            users: [user],
            user_id: user.user_id,
            game_id: 1,
          })
        }
      >
        Create Room
      </button>
    </div>
  )
}

export default Rooms

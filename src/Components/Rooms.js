import React, { useState, useEffect, useContext } from "react"
import { UserContext } from "../context/UserContext"
import axios from "axios"

const Rooms = () => {
  const {
    socket,
    user,
    room,
    setRoom,
  } = useContext(UserContext)
  const [rooms, setRooms] = useState([])
  useEffect(() => {
    axios.get("/api/rooms").then(({ data }) => setRooms(data))
  }, [])
  useEffect(() => {
    socket.on("create-room", (body) => {
      console.log("hit create")
      console.log(body)
      setRoom({...body, users: [user]})
    })
    socket.on("rooms", (body) => {
      console.log("hit rooms")
      console.log(body)
      setRooms(body)
    })
    socket.on('join-room', (body) => {
      console.log(body)
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
            <div>
              <div>{e.room_id}</div>
              <button onClick={() => joinRoom(e.room_id)}>Join Room</button>
            </div>
          )
        })}
      </div>
      <button
        onClick={() => socket.emit("create-room", { user_id: user.user_id, game_id: 1 })}
      >
        Create Room
      </button>
    </div>
  )
}

export default Rooms

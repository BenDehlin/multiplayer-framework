import React, { useState, useEffect, useContext } from "react"
import { UserContext } from "../context/UserContext"
import axios from "axios"

const Rooms = () => {
  const { socket, user: {user_id}, room, setRoom } = useContext(UserContext)
  const [rooms, setRooms] = useState([])
  useEffect(() => {
    axios.get("/api/rooms").then(({ data }) => setRooms(data))
  }, [])
  useEffect(() => {
    socket.on('join-room', (body) => {
      console.log('hit join')
      console.log(body)
      setRoom(body)
    })
    socket.on('rooms', (body) => {
      console.log('hit rooms')
      console.log(body)
      setRooms(body)
    })
  }, [])
  return (
    <div>
      <h1>Rooms:</h1>
      <div>
        {rooms.map((e) => {
          return <div>{e.room_id}</div>
        })}
      </div>
      <button
      onClick = {() => socket.emit('create-room', {user_id, game_id: 1})}
      >Create Room</button>
    </div>
  )
}

export default Rooms

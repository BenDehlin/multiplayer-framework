import React, { useContext, useEffect } from "react"
import { UserContext } from "../context/UserContext"

const Room = () => {
  const { room, setRoom, socket, user: {user_id} } = useContext(UserContext)

  useEffect(() => {
    socket.on("room", (room) => {
      setRoom(room)
    })
    socket.on("host-disconnected", () => {
      setRoom(null)
    })
  }, [])
  const cancelRoom = () => {
      console.log(room)
      socket.emit('cancel-room', {room_id: room.room_id, user_id})
  }
  const leaveRoom = () => {
      setRoom(null)
      socket.emit('leave-room', {room_id: room.room_id, user_id})
  }
  const startGame = () => {}
  return (
    <div>
      <div>Room</div>
      {room.users.map((e) => (
        <div key={e.room_id}>{e.username}</div>
      ))}
      {room.user_id === user_id ? (
        <button onClick={cancelRoom}>Cancel Room</button>
      ) : (
        <button onClick={leaveRoom}>Leave Room</button>
      )}
      <button onClick={startGame}>Start Game</button>
    </div>
  )
}

export default Room

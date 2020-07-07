import React, { useContext, useEffect } from "react"
import { UserContext } from "../context/UserContext"

const Room = () => {
  const { room, setRoom, socket } = useContext(UserContext)

  useEffect(() => {
      socket.on('new-user', (room) => {
          setRoom(room)
      })
  }, [])
  const cancelRoom = () => {}
  const startGame = () => {}
  return (
    <div>
      <div>Room</div>
      {room.users.map(e => (
          <div key={e.room_id}>{e.username}</div>
      ))}
      <button onClick={cancelRoom}></button>
      <button onClick={startGame}>Start Game</button>
    </div>
  )
}

export default Room

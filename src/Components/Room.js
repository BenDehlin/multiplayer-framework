import React, { useContext, useEffect } from "react"
import { useDispatch } from "react-redux"
import { UserContext } from "../context/UserContext"
import { setGameStart } from "../redux/redux"

const Room = () => {
  const {
    room,
    setRoom,
    socket,
    user: { user_id },
  } = useContext(UserContext)
  const dispatch = useDispatch()

  useEffect(() => {
    socket.on("room", (room) => {
      setRoom(room)
    })
    socket.on("host-disconnected", () => {
      setRoom(null)
    })
    socket.on("game-start", (body) => {
      dispatch(setGameStart(body))
    })
  }, [])
  const cancelRoom = () => {
    socket.emit("cancel-room", { room_id: room.room_id, user_id })
  }
  const leaveRoom = () => {
    setRoom(null)
    socket.emit("leave-room", { room_id: room.room_id, user_id })
  }
  const startGame = () => {
    socket.emit("start-game", { room_id: room.room_id, players: room.users })
  }
  return (
    <div>
      <div>Room</div>
      <div>Game: {room.game_name}</div>
      <div>Host: {room.users[0].username}</div>
      {room.users.map((e) => (
        <div key={e.room_id}>{e.username}</div>
      ))}
      {room.user_id === user_id ? (
        <div>
          <button onClick={cancelRoom}>Cancel Room</button>
          <button onClick={startGame}>Start Game</button>
        </div>
      ) : (
        <button onClick={leaveRoom}>Leave Room</button>
      )}
    </div>
  )
}

export default Room

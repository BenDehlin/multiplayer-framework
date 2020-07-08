import React, { useContext } from "react"
import useAuth from "../hooks/useAuth"
import Rooms from "./Rooms"
import { UserContext } from "../context/UserContext"
import UserList from "./UserList"
import Room from "./Room"
import Game from './Game'
import { useSelector } from "react-redux"

const Dashboard = () => {
  const { user, socket, room } = useContext(UserContext)
  const {gameStart} = useSelector(redux => redux)
  useAuth()
  return (
    <div>
      {user && socket && (
        <div>
          {room ? (
            <div>{gameStart ? <Game /> : <Room />}</div>
          ) : (
            <div>
              <UserList />
              <Rooms />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Dashboard

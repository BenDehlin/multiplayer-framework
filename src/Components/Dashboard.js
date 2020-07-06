import React, { useContext } from "react"
import useAuth from "../hooks/useAuth"
import Rooms from "./Rooms"
import { UserContext } from "../context/UserContext"
import UserList from "./UserList"
import Room from "./Room"

const Dashboard = () => {
  const { user, socket, room } = useContext(UserContext)
  useAuth()
  return (
    <div>
      {user && socket && (
        <div>
          {room ? (
            <Room />
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

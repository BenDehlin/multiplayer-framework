import React, { useContext, useState, useEffect } from "react"
import axios from "axios"
import { UserContext } from "../context/UserContext"

const UserList = () => {
  const { user, socket } = useContext(UserContext)
  const [users, setUsers] = useState([])
  useEffect(() => {
    axios
      .get("/api/users")
      .then(({ data }) => {
        setUsers(data)
      })
      .catch((err) => console.log(err))
  }, [])
  useEffect(() => {
    socket.emit('join', user)
  }, [])
  return <div>{users}</div>
}

export default UserList

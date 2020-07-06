import React, { useContext } from 'react'
import { UserContext } from '../context/UserContext'

const Room = () => {
    const {room} = useContext(UserContext)
    return (
        <div>Room</div>
    )
}

export default Room
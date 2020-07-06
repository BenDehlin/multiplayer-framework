import React, { useContext, useEffect } from 'react'
import { UserContext } from '../context/UserContext'

const Room = () => {
    const {room} = useContext(UserContext)

    useEffect(() => {
        
    }, [])
    return (
        <div>Room</div>
    )
}

export default Room
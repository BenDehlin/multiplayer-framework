// const {initialGameState} = require('./initialGameState')

const removeSocketId = (users) =>
  users.map(({ username, email, user_id }) => ({
    username,
    email,
    user_id,
  }))

const removeUserFromList = (app, socket) => {
  try {
    const io = app.get("io")
    const users = app.get("users")
    // const { userIndex, user_id } = users.reduce(
    //   (acc, e, i) => {
    //     if (e.socket_id === socket.id) {
    //       acc.userIndex = i
    //       acc.user_id = e.user_id
    //     }
    //     return acc
    //   },
    //   { userIndex: null, user_id: null }
    // )
    const user = users.find((e) => e.socket_id === socket.id)
    console.log({user})
    const filteredUsers = users.filter((e) => +e.user_id !== +user.user_id)
    console.log({filteredUsers})
    // users.splice(userIndex, 1)
    // console.log(filteredUsers)
    app.set("users", filteredUsers)
    socket.leave("userlist")
    io.in("userlist").emit("users", removeSocketId(filteredUsers))
    return user.user_id
  } catch {
    return null
  }
}
// const removeUserFromGame = (user_id, app) => {
//   const lobbies = app.get("lobbies")
//   const io = app.get("io")
//   const users = app.get("users")
//   const newLobbies = lobbies.filter(
//     (e) => e.players[0].user_id !== user_id && e.players[1].user_id !== user_id
//   )
//   app.set("lobbies", newLobbies)
//   const removeLobbies = lobbies
//     .filter(
//       (e) =>
//         e &&
//         e.players &&
//         e.players[0] &&
//         e.players[1] &&
//         (e.players[0].user_id === user_id || e.players[1].user_id === user_id)
//     )
//     .reduce((acc, e) => {
//       if (e.players[0].user_id === user_id) {
//         acc.push(e.players[1])
//       } else {
//         acc.push(e.players[0])
//       }
//       return acc
//     }, [])
//   if (removeLobbies.length > 0) {
//     const opponentSocket = users.find(
//       (u) => +removeLobbies[0].user_id === +u.user_id
//     )
//     if (opponentSocket && opponentSocket.socket_id) {
//       io.to(opponentSocket.socket_id).emit("opponent-left")
//     }
//   }
// }

module.exports = {
  removeSocketId,
  removeUserFromList,
  // removeUserFromGame,
}

const initialGameState = {
  active: false,
  gameStart: true,
  room: `${challenger.user_id}-${opponent.user_id}`,
  activePlayer,
  players: [challenger, opponent],
  turn: 0,
}

module.exports = {initialGameState}
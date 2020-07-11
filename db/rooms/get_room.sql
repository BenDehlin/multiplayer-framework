SELECT *
FROM rooms
  join games on (rooms.game_id = games.game_id)
WHERE user_id = $1
  AND rooms.game_id = $2;
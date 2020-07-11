SELECT *
FROM rooms
  join games on (rooms.game_id = games.game_id)
where rooms.game_id = $1
  AND rooms.active = true;
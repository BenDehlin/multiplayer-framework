SELECT *
FROM rooms
  join games on (rooms.game_id = games.game_id)
where active = true;
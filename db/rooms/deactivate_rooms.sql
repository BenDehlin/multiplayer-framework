UPDATE rooms
SET active = false
WHERE user_id = $1;
SELECT *
FROM rooms
  join games on (rooms.game_id = games.game_id)
where rooms.active = true;
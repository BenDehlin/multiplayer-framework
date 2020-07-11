INSERT INTO rooms (user_id, game_id, active)
VALUES ($1, $2, true);
SELECT *
FROM rooms
  join games on (rooms.game_id = games.game_id)
WHERE room.user_id = $1;
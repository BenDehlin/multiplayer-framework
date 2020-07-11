UPDATE rooms
SET active = true
where room_id = $1;
SELECT *
FROM rooms
  join games on (rooms.game_id = games.game_id)
where rooms.room_id = $1;
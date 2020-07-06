INSERT INTO rooms (user_id, game_id, active) VALUES ($1, $2, true);
SELECT * FROM rooms WHERE user_id = $1;
UPDATE rooms SET active = false WHERE user_id = $1;
SELECT * FROM rooms where active = true;
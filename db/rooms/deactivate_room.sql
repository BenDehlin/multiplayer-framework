UPDATE rooms SET active = false where room_id = $1;
SELECT * FROM rooms where active = true;
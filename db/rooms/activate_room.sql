UPDATE rooms SET active = true where room_id = $1;
SELECT * FROM rooms where room_id = $1;
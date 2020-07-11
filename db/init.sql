CREATE TABLE users (
   user_id serial primary key,
   username varchar(50) not null,
   email varchar(150) not null,
   password varchar(300) not null,
   "createdAt" date default now(),
   "updatedAt" date default now(),
   is_admin boolean not null
);
CREATE TABLE games (
   game_id serial primary key,
   game_name varchar(20),
   min_players integer default 2,
   max_players integer default 2,
   "createdAt" date default now(),
   "updatedAt" date default now()
);
CREATE TABLE rooms (
   room_id serial primary key,
   user_id integer references users(user_id),
   game_id integer references games(game_id),
   active boolean default false,
   "createdAt" date default now(),
   "updatedAt" date default now()
);
-- host_id instead of user_id?
CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  hobbies TEXT NOT NULL,
  interests TEXT NOT NULL,
  zipcode TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  friend_radius INTEGER NOT NULL,
  photo TEXT NOT NULL
);

CREATE TABLE user_preferences (
  username VARCHAR(25) NOT NULL,
  target_username VARCHAR(25) NOT NULL,
  is_liked BOOLEAN NOT NULL,
  time_liked TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (username, target_username),
  FOREIGN KEY (username) REFERENCES users(username),
  FOREIGN KEY (target_username) REFERENCES users(username)
);
CREATE TABLE users (
   id serial PRIMARY KEY,
   first_name VARCHAR(50) NOT NULL,
   middle_name VARCHAR(50),
   last_name VARCHAR(50) NOT NULL,
   email VARCHAR(150) UNIQUE,
   password VARCHAR(150),
   profile_pic TEXT,
   isfb INT,
   fb_id TEXT,
   ip VARCHAR(50),
   user_agent VARCHAR(250),
   time TIMESTAMP DEFAULT now()
  );

ALTER TABLE users
ADD COLUMN middle_name VARCHAR(50),
ADD COLUMN bio VARCHAR(250),
ADD COLUMN points INT,


CREATE TABLE questions (
   id serial PRIMARY KEY,
   user_id INT NOT NULL,
   question VARCHAR(2000) NOT NULL,
   img TEXT,
   question_type VARCHAR(50),
   choices_num INT,
   choices VARCHAR(2000) NOT NULL,
   answer INT,
   isapproved INT,
   time TIMESTAMP DEFAULT now()
)
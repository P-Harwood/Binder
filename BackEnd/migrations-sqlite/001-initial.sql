DROP TABLE IF EXISTS match_request;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS hobbies;
DROP TABLE IF EXISTS modules;
DROP TABLE IF EXISTS images;
DROP TABLE IF EXISTS user_hobbies;
DROP TABLE IF EXISTS user_interactions;
DROP TABLE IF EXISTS auth_keys;

CREATE TABLE match_request (
  match_id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_id INTEGER NOT NULL,
  receiver_id INTEGER NOT NULL,
  match_status text,
  FOREIGN KEY (sender_id)
    REFERENCES users(user_id),
  FOREIGN KEY (receiver_id)
    REFERENCES users(user_id)

);
CREATE TABLE users (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT,
  firstname text NOT NULL,
  lastname text NOT NULL,
  email text NOT NULL,
  lastMatch_ID INTEGER DEFAULT 0,
  university_ID text,
  biography VARCHAR(50),
  currently_revising STRING DEFAULT "Not Currently Revising"

);


CREATE TABLE hobbies (
  entry_id INTEGER PRIMARY KEY AUTOINCREMENT,
  interest_name text NOT NULL,
  user_id INTEGER NOT NULL,
  FOREIGN KEY (user_id)
    REFERENCES users(user_id)

  );
CREATE TABLE modules (
  entry_id INTEGER PRIMARY KEY AUTOINCREMENT,
  interest_name text NOT NULL,
  user_id INTEGER NOT NULL,
  FOREIGN KEY (user_id)
    REFERENCES users(user_id)

  );

CREATE TABLE images (
    image_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    image_location text NOT NULL,
    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
);



CREATE TABLE conversations (
  conversation_id INTEGER PRIMARY KEY AUTOINCREMENT,
  person1_id INTEGER NOT NULL,
  person2_id INTEGER NOT NULL,
  interaction_status STRING DEFAULT "PENDING",
  sent_by_user INTEGER NOT NULL,
  conversation_started TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (person1_id) REFERENCES users (user_id),
  FOREIGN KEY (person2_id) REFERENCES users (user_id),
  FOREIGN KEY (sent_by_user) REFERENCES users (user_id)
);
CREATE TABLE messages (
  message_id INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id INTEGER,
  sender_id INTEGER,
  content TEXT,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(conversation_id) REFERENCES conversations(conversation_id),
  FOREIGN KEY(sender_id) REFERENCES users(user_id)
);
CREATE TABLE auth_keys (
  auth_id INTEGER PRIMARY KEY AUTOINCREMENT,
  auth_hash VARCHAR(64),
  user_id INTEGER,
  FOREIGN KEY(user_id) REFERENCES users(user_id)

  );



INSERT INTO users (firstname, lastname, email,university_ID, biography) VALUES
('John', 'Doe', 'johndoe@gmail.com', "gmail.com", 'I am a software developer.'),
('Jane', 'Doe', 'janedoe@gmail.com', "gmail.com", 'I am a writer.'),
('Bob', 'Smith', 'bobsmith@gmail.com', "gmail.com", NULL),
('Alice', 'Jones', 'alicejones@gmail.com', "gmail.com", 'I am a student.');

INSERT INTO conversations (person1_id, person2_id, sent_by_user) VALUES
(1, 2, 1),
(1,3, 1),
(1,4, 1);

INSERT INTO conversations (person1_id, person2_id, interaction_status, sent_by_user) VALUES
(1, 5, "match", 1);




INSERT INTO messages (conversation_id, sender_id, content) VALUES
    (1, 1, "Hey, how's it going?"),
    (1, 2, "Not bad, thanks for asking. How about you?"),
    (1, 1, "Doing pretty well too. Did you see the new movie that just came out?"),
    (1, 2, "No, I haven't had a chance to go to the theater in a while. How was it?"),
    (1, 1, "It was really good! You should definitely check it out when you get the chance."),
    (1, 2, "I'll keep that in mind. Thanks for the recommendation!"),
    (1, 1, "No problem. So, what are your plans for the weekend?"),
    (1, 2, "I'm not sure yet. Maybe just relax at home and catch up on some reading. How about you?"),
    (1, 1, "I was thinking about going for a hike on Saturday. Maybe you'd like to join me?"),
    (1, 2, "That sounds like a lot of fun! Count me in.");






INSERT INTO modules (user_id, interest_name) VALUES
(1,'Introduction to Computer Science'),
(1,'Programming 1'),
(1,'Programming 2'),
(1,'Data Structures and Algorithms');


INSERT INTO hobbies (user_id, interest_name) VALUES
(1,'Reading'),
(1,'Running'),
(1,'Cooking'),
(1,'Gardening');

INSERT INTO images (user_id, image_location)
VALUES
(1, '.public/images/5-1683161178235-313628868.jpg'),
(2, '.public/images/5-1683162031826-398214340.jpg'),
(3, '.public/images/5-1683163792386-975615205.jpg'),
(4, '.public/images/5-1683163869631-932438315.jpg'),
(1, '.public/images/5-1683164102291-57608687.jpg'),
(2, '.public/images/5-1683164557910-494018266.jpg'),
(3, '.public/images/5-1683164654246-710074974.jpg'),
(4, '.public/images/5-1683164687369-930900414.jpg'),
(1, '.public/images/5-1683169225434-954334056.jpg'),
(2, '.public/images/5-1683169498415-495228881.jpg'),
(3, '.public/images/5-1683169939015-555266980.jpg'),
(4, '.public/images/5-1683170117394-483544266.jpg'),
(1, '.public/images/5-1683170144805-83726949.jpg'),
(2, '.public/images/5-1683173747591-546859633.jpg'),
(3, '.public/images/5-1683174024995-922892423.jpg'),
(4, '.public/images/5-1683174078212-717492533.jpg'),
(1, '.public/images/5-1683174163316-208849849.jpg'),
(2, '.public/images/5-1683174187062-185417712.jpg'),
(3, '.public/images/test.jpg');
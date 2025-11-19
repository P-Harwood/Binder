import pkg from 'pg';

const { Pool } = pkg;


async function init() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  return pool;
}

const dbConn = init();

async function queryAll(text, params = []) {
  const db = await dbConn;
  const { rows } = await db.query(text, params);
  return rows;
}

async function queryOne(text, params = []) {
  const rows = await queryAll(text, params);
  return rows[0] || null;
}

async function execute(text, params = []) {
  const db = await dbConn;
  await db.query(text, params);
}

/* --- Match / conversations --- */

export async function sendMatch(senderID, matchID) {
  return execute(
    'INSERT INTO conversations (person1_id, person2_id, sent_by_user) VALUES ($1, $2, $3);',
    [senderID, matchID, senderID],
  );
}

export async function sendBlock(senderID, matchID) {
  return execute(
    'INSERT INTO conversations (person1_id, person2_id, sent_by_user, interaction_status) VALUES ($1, $2, $3, $4);',
    [senderID, matchID, senderID, 'block'],
  );
}

export async function confirmMatch(conversation_id) {
  return execute(
    'UPDATE conversations SET interaction_status = $1 WHERE conversation_id = $2;',
    ['match', conversation_id],
  );
}

export async function removeMatch(conversation_id) {
  return execute(
    'UPDATE conversations SET interaction_status = $1 WHERE conversation_id = $2;',
    ['block', conversation_id],
  );
}

export async function checkMatch(senderID, matchID) {
  return queryOne(
    'SELECT * FROM conversations WHERE person2_id = $1 AND sent_by_user = $2;',
    [senderID, matchID],
  );
}

/* --- User profile + matching --- */

export async function returnProfile(userID) {
  return queryOne('SELECT * FROM users WHERE user_id = $1;', [userID]);
}

export async function getUserProfileDetails(userID) {
  return queryAll(
    `
    SELECT entry_id AS id, interest_name AS name, 'modules' AS type
    FROM modules
    WHERE user_id = $1
    UNION
    SELECT entry_id AS id, interest_name AS name, 'hobbys' AS type
    FROM hobbies
    WHERE user_id = $1
    UNION
    SELECT image_id AS id, image_location AS link, 'images' AS type
    FROM images
    WHERE user_id = $1;
    `,
    [userID],
  );
}

export async function getMatches(userID, lastMatch, userUni) {
  // Simple "later IDs + same uni" heuristic
  return queryAll(
    `
    SELECT *
    FROM users
    WHERE user_id != $1
      AND user_id > $2
      AND university_id LIKE '%' || $3 || '%'
    LIMIT 10;
    `,
    [userID, lastMatch, userUni],
  );
}

export async function updateLastMatch(user_id, lastMatch) {
  return execute('UPDATE users SET lastmatch_id = $1 WHERE user_id = $2;', [
    lastMatch,
    user_id,
  ]);
}

// Hobbies / modules

export async function returnHobbies(user_id) {
  return queryAll(
    'SELECT entry_id, interest_name FROM hobbies WHERE user_id = $1;',
    [user_id],
  );
}

export async function returnModules(user_id) {
  return queryAll(
    'SELECT entry_id, interest_name FROM modules WHERE user_id = $1;',
    [user_id],
  );
}

export async function addHobbies(userID, newValue) {
  return execute(
    'INSERT INTO hobbies (user_id, interest_name) VALUES ($1, $2);',
    [userID, newValue],
  );
}

export async function addModules(userID, newValue) {
  return execute(
    'INSERT INTO modules (user_id, interest_name) VALUES ($1, $2);',
    [userID, newValue],
  );
}

export async function updateHobbies(selectedID, updatedValue) {
  return execute(
    'UPDATE hobbies SET interest_name = $1 WHERE entry_id = $2;',
    [updatedValue, selectedID],
  );
}

export async function updateModules(selectedID, updatedValue) {
  return execute(
    'UPDATE modules SET interest_name = $1 WHERE entry_id = $2;',
    [updatedValue, selectedID],
  );
}

export async function removeHobbies(selectedID) {
  return execute('DELETE FROM hobbies WHERE entry_id = $1;', [selectedID]);
}

export async function removeModules(selectedID) {
  return execute('DELETE FROM modules WHERE entry_id = $1;', [selectedID]);
}

//Revising status

export async function getUserRevising(user_id) {
  return queryOne(
    'SELECT currently_revising FROM users WHERE user_id = $1;',
    [user_id],
  );
}

export async function updateUserRevising(user_id, currently_revising) {
  return execute(
    'UPDATE users SET currently_revising = $1 WHERE user_id = $2;',
    [currently_revising, user_id],
  );
}

//C onversations + messages

export async function getConversations(user_id) {
  return queryAll(
    `
    SELECT 
      c.conversation_id, 
      c.person1_id, 
      u1.firstname AS person1_firstname, 
      u1.lastname AS person1_lastname,
      u1.currently_revising AS person1_currently_revising,
      c.person2_id, 
      u2.firstname AS person2_firstname, 
      u2.lastname AS person2_lastname, 
      u2.currently_revising AS person2_currently_revising
    FROM conversations c
      JOIN users AS u1 ON c.person1_id = u1.user_id 
      JOIN users AS u2 ON c.person2_id = u2.user_id 
    WHERE c.interaction_status = 'match'
      AND (c.person1_id = $1 OR c.person2_id = $1);
    `,
    [user_id],
  );
}

export async function getMessages(conversationID) {
  return queryAll(
    'SELECT * FROM messages WHERE conversation_id = $1;',
    [conversationID],
  );
}

export async function sendMessage(messageDetails) {
  return execute(
    'INSERT INTO messages (conversation_id, sender_id, content) VALUES ($1, $2, $3);',
    [
      messageDetails['conversationID'],
      messageDetails['sender_id'],
      messageDetails['message'],
    ],
  );
}

export async function checkConversation(conversationID, lastMessageID) {
  return queryAll(
    'SELECT * FROM messages WHERE conversation_id = $1 AND message_id > $2;',
    [conversationID, lastMessageID],
  );
}

// Auth and login

export async function createAuth(user_ID, authHash) {
  return execute(
    'INSERT INTO auth_keys (user_id, auth_hash) VALUES ($1, $2);',
    [user_ID, authHash],
  );
}

export async function updateAuth(user_ID, authHash) {
  return execute(
    'UPDATE auth_keys SET auth_hash = $1 WHERE user_id = $2;',
    [authHash, user_ID],
  );
}

export async function getAuth(user_ID) {
  return queryOne(
    'SELECT auth_hash FROM auth_keys WHERE user_id = $1;',
    [user_ID],
  );
}

export async function checkEmail(emailAddress) {
  return queryOne('SELECT * FROM users WHERE email = $1;', [emailAddress]);
}

// Biography

export async function updateBiography(user_id, biography) {
  return execute('UPDATE users SET biography = $1 WHERE user_id = $2;', [
    biography,
    user_id,
  ]);
}

export async function getBiography(userID) {
  return queryOne('SELECT biography FROM users WHERE user_id = $1;', [userID]);
}

//Images

export async function addImage(userID, imageLocation) {
  return execute(
    'INSERT INTO images (user_id, image_location) VALUES ($1, $2);',
    [userID, imageLocation],
  );
}

export async function findImage(imageID) {
  return queryOne(
    'SELECT image_location FROM images WHERE image_id = $1;',
    [imageID],
  );
}

export async function returnImages(userID) {
  return queryAll(
    'SELECT image_location, image_id FROM images WHERE user_id = $1;',
    [userID],
  );
}

export async function removeImages(imageID) {
  return execute('DELETE FROM images WHERE image_id = $1;', [imageID]);
}

// User creation

export async function createUser(userDetails) {
  const emailDomain = userDetails['email'].substring(
    userDetails['email'].indexOf('@') + 1,
  );

  return execute(
    `
    INSERT INTO users (firstname, lastname, email, university_id, biography)
    VALUES ($1, $2, $3, $4, NULL);
    `,
    [
      userDetails['firstName'],
      userDetails['lastName'],
      userDetails['email'],
      emailDomain,
    ],
  );
}

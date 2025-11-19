import express from 'express';
import * as Api from './Database.mjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import http from 'http';
import { Server } from 'socket.io';

import { OAuth2Client } from 'google-auth-library';
import sharp from 'sharp';
import multer from 'multer';
import crypto from 'crypto';

import { RSA, Crypt } from 'hybrid-crypto-js';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './public/Images/');
  },
  filename(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg');
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1000 * 1024 * 1024 }, // 100MB
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

const server = http.createServer(app);
const io = new Server(server);

// userId -> socketId
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  socket.on('join', () => {
    console.log('User joined with socket ID:', socket.id);
    socket.emit('requestPublic');
  });

  socket.emit('message', 'message');

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }
  });

  socket.on('deleteListing', (listingDetails) => {
    // currently unused
  });

  // RSA / AES handshake (hybrid-crypto-js)
  socket.on('RequestRSA', () => {
    try {
      const rsa = new RSA();
      rsa.generateKeyPair((keyPair) => {
        socket.publicKey = keyPair.publicKey;
        socket.privateKey = keyPair.privateKey;
        console.log('Public key generated for socket:', socket.id);

        socket.emit('ServerRSA', socket.publicKey);
      });
    } catch (error) {
      console.log('Error generating RSA key pair:', error);
    }
  });

  socket.on('ClientAESKey', (encryptedAESKey) => {
    try {
      const crypt = new Crypt();
      console.log('Encrypted AES payload:', encryptedAESKey);

      const decryptedAESKey = crypt.decrypt(socket.privateKey, encryptedAESKey.key);
      const decryptedIV = crypt.decrypt(socket.privateKey, encryptedAESKey.IV);

      socket.aesKey = decryptedAESKey.message;
      socket.iv = decryptedIV.message;

      console.log(
        'AES key + IV decrypted for socket:',
        socket.id,
        'AES:',
        socket.aesKey,
        'IV:',
        socket.iv,
      );
    } catch (error) {
      console.log('Error decrypting AES key and IV:', error);
    }
  });

  /* ==== Matching / profile ==== */

  socket.on('Give Matches', async (userDetails) => {
    try {
      const profile = await Api.returnProfile(userDetails['user_id']);
      const matches = await Api.getMatches(
        profile['user_id'],
        profile['lastmatch_id'],
        profile['university_id'],
      );

      let userArray = [];

      for (let i = 0; i < matches.length; i++) {
        const baseUser = matches[i];
        const user = { user: baseUser, hobbies: [], images: [], modules: [] };

        const matchDetails = await Api.getUserProfileDetails(baseUser['user_id']);

        for (let j = 0; j < matchDetails.length; j++) {
          const entry = matchDetails[j];
          if (entry.type === 'hobbys') {
            user.hobbies.push(entry);
          } else if (entry.type === 'modules') {
            user.modules.push(entry);
          } else if (entry.type === 'images') {
            user.images.push({
              id: entry.id,
              name: entry.name || entry.link,
            });
          }
        }

        userArray.push(user);
      }

      if (!userArray.length) {
        userArray = null;
      }

      console.log('New matches payload:', userArray);
      socket.emit('New Matches', userArray);
    } catch (error) {
      console.error('Give Matches error:', error);
      socket.emit('New Matches', null);
    }
  });

  socket.on('Create User', async (userDetails) => {
    try {
      const emailResult = await Api.checkEmail(userDetails['email']);

      if (!emailResult) {
        await Api.createUser(userDetails);
        const newEmailResult = await Api.checkEmail(userDetails['email']);
        console.log('Created user:', newEmailResult);

        const authKey = await createAuth(newEmailResult['user_id']);
        const userIdNum = Number(newEmailResult['user_id']);
        connectedUsers.set(userIdNum, socket.id);

        socket.emit('User Exists', newEmailResult, authKey);
      }
    } catch (error) {
      console.error('Create User error:', error);
    }
  });

  socket.on('Remove Hobbies', async (user_id, hobby_id) => {
    await Api.removeHobbies(hobby_id);
    const hobbies = await Api.returnHobbies(user_id);
    socket.emit('Give Hobbies', hobbies);
  });

  socket.on('Remove Modules', async (user_id, module_id) => {
    await Api.removeModules(module_id);
    const modules = await Api.returnModules(user_id);
    socket.emit('Give Modules', modules);
  });

  socket.on('Add Hobbies', async (user_id, hobby) => {
    console.log('Add Hobby', user_id, hobby);
    await Api.addHobbies(user_id, hobby);
    const hobbies = await Api.returnHobbies(user_id);
    socket.emit('Give Hobbies', hobbies);
  });

  socket.on('Add Modules', async (user_id, module) => {
    await Api.addModules(user_id, module);
    const modules = await Api.returnModules(user_id);
    socket.emit('Give Modules', modules);
  });

  socket.on('Remove Image', async (imageID) => {
    console.log('Removing image', imageID);
    try {
      await Api.removeImages(imageID);
      socket.emit('Image Removed');
    } catch (error) {
      console.log('Remove Image error:', error);
    }
  });

  socket.on('Highlight User', async (senderID, matchID) => {
    try {
      const isMatch = await Api.checkMatch(senderID, matchID);

      if (isMatch) {
        if (isMatch['interaction_status'] !== 'block') {
          await Api.confirmMatch(isMatch['conversation_id']);
        }
      } else {
        await Api.sendMatch(senderID, matchID);
      }
      await Api.updateLastMatch(senderID, matchID);
    } catch (error) {
      console.log('Highlight User error:', error);
    }
  });

  socket.on('Skip User', async (senderID, matchID) => {
    try {
      const isMatch = await Api.checkMatch(senderID, matchID);
      if (isMatch) {
        await Api.removeMatch(isMatch['conversation_id']);
      } else {
        await Api.sendBlock(senderID, matchID);
      }
      await Api.updateLastMatch(senderID, matchID);
    } catch (error) {
      console.log('Skip User error:', error);
    }
  });

  socket.on('Update Biography', async (user_id, biography) => {
    console.log('Update biography', user_id, biography);
    await Api.updateBiography(user_id, biography);
    const updatedBiography = await Api.getBiography(user_id);
    console.log('Updated biography:', updatedBiography);
    socket.emit('Give Biography', updatedBiography);
  });

  socket.on('Update Hobbies', async (user_id, hobby_id, hobby) => {
    console.log('Update Hobbies', user_id, hobby_id, hobby);
    await Api.updateHobbies(hobby_id, hobby);
    const hobbies = await Api.returnHobbies(user_id);
    socket.emit('Give Hobbies', hobbies);
  });

  socket.on('Update Modules', async (user_id, module_id, module) => {
    await Api.updateModules(module_id, module);
    const modules = await Api.returnModules(user_id);
    socket.emit('Give Modules', modules);
  });

  socket.on('Set Revising', async (user_id, revisingValue) => {
    console.log('Set Revising', revisingValue, user_id);
    await Api.updateUserRevising(user_id, revisingValue);
    const currentlyRevising = await Api.getUserRevising(user_id);
    console.log('Set Revising result:', currentlyRevising);

    socket.emit('currently Revising', currentlyRevising?.currently_revising || 'Not Currently Revising');
  });

  socket.on('Get Revising', async (user_id) => {
    const currentlyRevising = await Api.getUserRevising(user_id);
    console.log('Get Revising', user_id, currentlyRevising);
    socket.emit('currently Revising', currentlyRevising?.currently_revising || 'Not Currently Revising');
  });

  socket.on('Get Biography', async (user_id) => {
    const biography = await Api.getBiography(user_id);
    socket.emit('Give Biography', biography);
  });

  socket.on('Get Hobbies', async (user_id) => {
    const hobbies = await Api.returnHobbies(user_id);
    socket.emit('Give Hobbies', hobbies);
  });

  socket.on('Get Modules', async (user_id) => {
    const modules = await Api.returnModules(user_id);
    socket.emit('Give Modules', modules);
  });

  // Messaging 
  socket.on('checkConversation', async (conversationID, lastMessageID) => {
    const newMessages = await Api.checkConversation(conversationID, lastMessageID);
    socket.emit('New Messages', newMessages);
  });

  socket.on('sendMessage', async (msg, lastMessageID) => {
    console.log('message:', msg);

    await Api.sendMessage(msg);

    const newMessages = await Api.checkConversation(
      msg['conversationID'],
      lastMessageID,
    );
    socket.emit('New Messages', newMessages);

    const recipientId = Number(msg.recipientId);
    const recipientSocketId = connectedUsers.get(recipientId);

    if (recipientSocketId) {
      io.to(recipientSocketId).emit('New Messages', newMessages);
    }
  });

  //Google auth and Login functions

  socket.on('checkEmail', async (token, clientID) => {
    const client = new OAuth2Client(clientID);
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: clientID,
      });
      const payload = ticket.getPayload();
      const email = payload.email;

      console.log('Google payload:', payload);

      const emailResult = await Api.checkEmail(email);
      console.log('Email lookup result:', emailResult);

      if (emailResult) {
        console.log('User exists for email');
        const authKey = await createAuth(emailResult['user_id']);
        console.log('AuthKey:', authKey);

        const userIdNum = Number(emailResult['user_id']);
        connectedUsers.set(userIdNum, socket.id);

        socket.emit('User Exists', emailResult, authKey);
      } else {
        console.log('User does not exist for email');
        socket.emit('User Not Exist', {
          firstName: payload.given_name,
          lastName: payload.family_name,
          email: payload.email,
        });
      }
    } catch (error) {
      console.error('checkEmail error:', error);
    }
  });

  socket.on('test Auth', async (userID, authKey) => {
    console.log('testing auth key');
    const intUserID = parseInt(userID, 10);
    console.log('Received test auth', intUserID, authKey);

    const keyCheck = await checkAuth(intUserID, authKey);
    console.log('keyCheck', keyCheck);

    if (keyCheck) {
      console.log('Passed key check');
      const user = await Api.returnProfile(intUserID);

      const userIdNum = Number(user['user_id']);
      connectedUsers.set(userIdNum, socket.id);

      socket.emit('User Exists', user, authKey);
    }
  });
});

//Authentication functions

async function checkAuth(userID, authKey) {
  console.log('checkAuth params:', userID, authKey);
  const authHash = await Api.getAuth(userID);
  if (!authHash) {
    console.log('User has no auth hash');
    return false;
  }

  const hashedAuthKey = crypto.createHash('sha256').update(authKey).digest('hex');
  console.log('Comparing auth hashes');
  console.log('provided:', authKey);
  console.log('stored hash:', authHash['auth_hash']);
  console.log('computed hash:', hashedAuthKey);

  return authHash['auth_hash'] === hashedAuthKey;
}

async function createAuth(userID) {
  const authKey = crypto.randomBytes(32).toString('hex');
  const stringAuthKey = JSON.stringify(authKey);
  const authHash = crypto.createHash('sha256').update(stringAuthKey).digest('hex');

  console.log('Auth hash + key created:', authHash, authKey);
  const existing = await Api.getAuth(userID);

  if (!existing) {
    await Api.createAuth(userID, authHash);
    console.log('Creating new auth record');
  } else {
    await Api.updateAuth(userID, authHash);
    console.log('Updating existing auth record');
  }

  return stringAuthKey;
}

// Image upload + retrieval

async function uploadImage(req, res) {
  console.log('uploadImage userID:', req.params.userID);
  console.log('uploadImage body:', req.body);

  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  const inputPath = req.file.path;
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const outputPath = `./public/Images/${req.params.userID}-${uniqueSuffix}.jpg`;
  const tempPath = `./public/Images/temp-${req.file.originalname}`;

  try {
    await sharp(inputPath).jpeg().toFile(tempPath);

    fs.renameSync(tempPath, outputPath);
    await Api.addImage(req.params.userID, outputPath);
    res.status(200).json({ message: 'Image uploaded successfully' });
  } catch (error) {
    console.error('uploadImage error:', error);
    res.status(500).json({ error: 'Error writing file' });
  } finally {
    fs.unlinkSync(inputPath);
  }
}

async function returnImages(req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  const images = await Api.returnImages(req.params.userID);
  res.json(images);
}

async function removeImage(req, res) {
  console.log('Removing image via REST', req.params.imageID);
  try {
    res.header('Access-Control-Allow-Origin', '*');
    await Api.removeImages(req.params.imageID);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function returnImage(req, res) {
  console.log('Requested image', req.params.imageID);
  const location = await Api.findImage(req.params.imageID);
  console.log('Image location result:', location);

  try {
    const imagePath = location.image_location;
    const imageData = await fs.promises.readFile(imagePath);

    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Disposition', 'inline; filename=image.jpg');
    res.send(imageData);
  } catch (error) {
    console.error('returnImage error:', error);
    res.status(500).json({ error });
  }
}

// Conversations / messages HTTP

async function getConversations(req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  const values = await Api.getConversations(req.params.userID);
  console.log('getConversations result:', values);
  res.json(values);
}

async function getMessages(req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  const messages = await Api.getMessages(req.params.conversationID);
  res.json(messages);
}

// Express async wrapper

function asyncWrap(PassedFunction) {
  return (req, res, next) => {
    Promise.resolve(PassedFunction(req, res, next)).catch((error) =>
      next(error || new Error()),
    );
  };
}

// Routes

app.get('/getConversations/:userID', asyncWrap(getConversations));
app.get('/getMessages/:conversationID', asyncWrap(getMessages));

app.post('/uploadImage/:userID', upload.single('image'), asyncWrap(uploadImage));

app.get('/returnImage/:imageID', asyncWrap(returnImage));
app.get('/returnImages/:userID', asyncWrap(returnImages));

app.put('/removeImage/:imageID', asyncWrap(removeImage));

//Start server

server.listen(5000, () => {
  console.log('Server is running at http://192.168.1.120:5000');
});


# Binder – uni revision matching app

Binder is a React Native + Node.js app I built at university to help students find people to revise with. This was not meant to be used and distributed, just a project.

The target user is to sign in with their uni email, fill out a short profile (course, year, bio, hobbies/modules), then Binder suggests other students to match with. 
You can set yourself as “Currently Revising”, browse profiles, highlight/skip people and chat in-app.
There was no validation put in to ensure the user who signs up uses a university email, rather users could only match with those with matching email domains.
This was done through google authentication, so there was no need to send verification emails or such.

It’s an older project and has not been maintained.
---

## Application use cases

### Sign up and onboarding

- Sign in with Google using a university email.
- One-time profile setup:
  - First/last name (pulled from Google but editable).
  - University course (autocomplete backed by a simple dataset).
  - Year of study.
  - Short biography.

All of this is stored server-side and used for matching.

### Profile

- See your own profile with:
  - Name and “Currently Revising” status (toggle switch).
  - Biography (editable free text).
  - Hobbies and modules (add, edit, remove; capped list).
  - Image gallery (upload, view, delete).

Images are picked from the device gallery, sent to the backend, resized and stored on disk. The app just stores the paths in the database and pulls them back as needed.

### Matching

- Tap “Meet New People” in the bottom bar to see suggested matches.
- Each match shows:
  - Name.
  - Photo carousel (tap left/right side of the image to switch).
  - Biography, modules and hobbies on the final “page”.
- You can:
  - **Highlight** a user (records your interest and can turn into a “match”).
  - **Skip** a user (blocks or drops that interaction, depending on state).

Matching is based on university, last seen user id and simple interaction flags (`match`, `block`, etc.).

### Messaging

- Once you’ve matched with someone, they appear in **Messages**:
  - Search by name.
  - Tap a conversation to open chat.
- Chat view:
  - Messages are stored on the server and also cached on the device using AsyncStorage.
  - New messages are sent via Socket.IO and appended locally.
  - Layout is a straightforward “local vs remote” bubble style.

---

## How it’s put together

### Mobile app

- **Stack**: React Native functional components + hooks.
- **Navigation**:
  - Simple `currentPage` string state and a custom bottom bar (`Messages`, `Meet New People`, `Profile`, `Settings`).
  - Sign-up flow is managed with a small step-based state machine rather than a navigation library.
- **Auth**:
  - Google Sign-In on the client.
  - The token is sent to the backend and verified with `google-auth-library`.
- **State & storage**:
  - Per-screen React state.
  - Conversations cached in AsyncStorage so you don’t refetch everything on each open.
- **Images**:
  - Selected with `expo-image-picker`.
  - Uploaded via `fetch` + `FormData` to the backend.
  - Displayed via URLs returned from the server.

### Backend

- **Stack**: Node.js, Express, Socket.IO, PostgreSQL.
- **Database access**:
  - `pg` with a connection pool.
  - Parameterised queries (`$1, $2, …`) instead of string interpolation.
  - Schema/tables for users, conversations, messages, hobbies, modules, images, and auth keys.
- **Features**:
  - Google ID token verification (`google-auth-library`).
  - Matching logic (send/confirm/block matches and track `lastmatch_id`).
  - Profile fields (biography, hobbies, modules, “Currently Revising” flag).
  - Image upload and retrieval using `multer` + `sharp`, with images stored on disk and paths saved in Postgres.
- There’s some experimental RSA/AES code in place for encrypted channels, but it isn’t intergrated through the whole app . This was mostly an experiment.

---

## Running it

This is an older React Native project, so expect some outdated dependencies (React Native, Expo bits, Gradle/Android tooling, etc.). 

### Backend

From the backend/server folder:

```bash
npm install

# Make sure PostgreSQL is running and DATABASE_URL is set, e.g.
# export DATABASE_URL=postgres://user:password@localhost:5432/binder

node server.mjs

```

-   Exposes HTTP + websockets on port `5000`.
    
-   Serves static files (images) from `public/`.
    
-   The mobile app reads the base URL from `Config("url")`, this is in resources/config.js (e.g. `http://192.168.x.x:5000` on the same network).
    

### Mobile app

From the React Native app root:

```bash
npm install

# Start Metro
npx react-native start

# Open run menu (this project only supports android)
npx react-native run

```
Dependencies and gradle may need to be updated.

----------

## Reflections / what I’d change now

Binder is an older project of mine, I feel I have improved a lot as a developer since creating this project. Improvements I would make if I was to revisit this project would be:
    
    
-   Some parts of the code are self-documenting, others aren’t – I’d add **comments or small helper functions** around the more tangled logic (socket event handling, matching, image flows).
    
-   Socket.IO is wired straight into components; I’d wrap it in a small client or custom hooks to keep UI code cleaner.
    
-   There’s minimal error handling, i would add in more validation, especially promise resolving. Additionaly, adding modals as warnings/errors .etc
    

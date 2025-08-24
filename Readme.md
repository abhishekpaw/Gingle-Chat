## Ginger Realtime Chat App

A real-time chat application whose style is heavily inspired by WhatsApp. Built using the MERN Stack (`MongoDB`, `Express.js`, `React`, `Node.js`) with `Firebase` for file storage and `Socket.IO` for instant messaging.

> [!WARNING]
> Messages sent in direct messages are **_not encrypted_** and are stored as **_plain text_** in the database. **DO NOT share** sensitive information, such as passwords, financial details, or any private data that you use in other applications or accounts. Use this chat app only for the purpose of previewing a demo application.

### 🚩 Live Demo

Current version running at: [https://realtime-chat-app-one-topaz.vercel.app](https://realtime-chat-app-one-topaz.vercel.app)

> [!NOTE]
> It may take up to 1 minute for the site to be brought up while the loading indicator is displayed, since free instances in Render will spin down with inactivity which can delay requests by 50 seconds or more.

### ✨ Features

- Theme Selection
- signing up & signing in
- setting up your profile info when signing in for the first time
- updating your profile info
- creating group messages
- real-time chatting with your friends in direct messages and groups
- sending images and other files in chats


### ⚙ Setup

- ### create a `.env` file in the `server` folder

```
PORT=5001
JWT_KEY="YOUR_JWT_KEY"
DATABASE_URL="YOUR_DATABASE_URL"

CLOUDINARY_CLOUD_NAME = CLOUD_NAME
CLOUDINARY_API_KEY = CLOUD_API_KEY
CLOUDINARY_API_SECRET = CLOUD_API_SECRET
```

### 🏃‍♂️ Running in local development mode

- `server`

```bash
cd server
npm install
npm run dev
```

- `client`

```bash
cd client
npm install
npm run dev
```
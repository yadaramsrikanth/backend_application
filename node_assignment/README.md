# Node Assignment

## Instructions to Run

1. Run `npm install` to install dependencies
2. Create a `.env` file in the root folder
3. Add your MongoDB URI in this format:
        MONGO_URI=your_mongodb_connection_string
4.Start the server using:
        node index.js

## Available Routes

- `GET /load` - Loads users, posts & comments into DB
- `GET /users/:userId` - Get one user with posts & comments
- `PUT /users` - Add new user
- `DELETE /users` - Delete all users
- `DELETE /users/:userId` - Delete one user by ID

---

## Notes

- `.env` and `node_modules` are excluded
- Make sure to set up MongoDB Atlas or use your own URI


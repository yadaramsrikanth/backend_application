require("dotenv").config()
const http = require('http');
const url = require('url');
const connectDB = require('./db');
const fetchData = require('./data');
const handleUserRoutes = require('./routes/userRoutes');

const PORT = process.env.PORT

http.createServer(async (req, res) => {
  const db = await connectDB();
  const { pathname } = url.parse(req.url, true);

  // GET /load - load dummy data
  if (req.method === 'GET' && pathname === '/load') {
    try {
      const [users, posts, comments] = await Promise.all([
        fetchData('https://jsonplaceholder.typicode.com/users'),
        fetchData('https://jsonplaceholder.typicode.com/posts'),
        fetchData('https://jsonplaceholder.typicode.com/comments'),
      ]);

      await db.collection('users').deleteMany({});
      await db.collection('posts').deleteMany({});
      await db.collection('comments').deleteMany({});

      await db.collection('users').insertMany(users);
      await db.collection('posts').insertMany(posts);
      await db.collection('comments').insertMany(comments);

      res.writeHead(200);
      res.end('Data loaded into DB');
    } catch (error) {
      res.writeHead(500);
      res.end('Error loading data');
    }
    return;
  }

  // All user-related routes
  await handleUserRoutes(req, res, db);

}).listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));

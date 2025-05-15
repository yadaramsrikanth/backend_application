const { parse } = require('url');

async function handleUserRoutes(req, res, db) {
  const usersCol = db.collection('users');
  const postsCol = db.collection('posts');
  const commentsCol = db.collection('comments');
  const { pathname } = parse(req.url, true);

  // DELETE /users - delete all users
  if (req.method === 'DELETE' && pathname === '/users') {
    await usersCol.deleteMany({});
    res.writeHead(200);
    res.end('All users deleted');
    return;
  }

  // DELETE /users/:id - delete one user
  if (req.method === 'DELETE' && pathname.startsWith('/users/')) {
    const id = pathname.split('/')[2];
    const result = await usersCol.deleteOne({ id: parseInt(id) });
    if (result.deletedCount === 0) {
      res.writeHead(404);
      res.end('User not found');
    } else {
      res.writeHead(200);
      res.end('User deleted');
    }
    return;
  }

  // GET /users/:id - get user + posts + comments
  if (req.method === 'GET' && pathname.startsWith('/users/')) {
    const id = pathname.split('/')[2];
    const user = await usersCol.findOne({ id: parseInt(id) });
    if (!user) {
      res.writeHead(404);
      res.end('User not found');
      return;
    }

    const posts = await postsCol.find({ userId: parseInt(id) }).toArray();
    for (let post of posts) {
      const postComments = await commentsCol.find({ postId: post.id }).toArray();
      post.comments = postComments;
    }
    user.posts = posts;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
    return;
  }

  // PUT /users - add new user
  if (req.method === 'PUT' && pathname === '/users') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', async () => {
      try {
        const newUser = JSON.parse(body);
        const exists = await usersCol.findOne({ id: newUser.id });
        if (exists) {
          res.writeHead(400);
          res.end('User already exists');
          return;
        }
        await usersCol.insertOne(newUser);
        res.writeHead(201, {
          'Content-Type': 'application/json',
          'Link': `/users/${newUser.id}`,
        });
        res.end(JSON.stringify({ message: 'User created' }));
      } catch {
        res.writeHead(400);
        res.end('Invalid JSON');
      }
    });
    return;
  }
}

module.exports = handleUserRoutes;

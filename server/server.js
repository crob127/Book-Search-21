const express = require('express');
const path = require('path');
const db = require('./config/connection');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const mongoose = require('mongoose');
const { typeDefs, resolvers } = require('./schemas');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// JWT key
const secret = process.env.JWT_SECRET || 'mysecret';

// JWT middleware
const authenticate = (req) => {
  const token = req.headers.authorization || '';
  if (token) {
    try {
      const user = jwt.verify(token.split(' ')[1], secret);
      return { user };
    } catch (err) {
      console.log('Invalid token');
    }
  }
  return {};
};

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://crob127:Oukv8pmUFqQg6Bga@cluster0.wpvt8.mongodb.net/BookSearchDB?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

const startApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const auth = authenticate(req);
      return { ...auth };
    },
  });

  await server.start();

  // Ensure Apollo server is registered with Express
  app.use('/graphql', expressMiddleware(server));

  // Serve static assets if in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  db.once('open', () => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

startApolloServer();

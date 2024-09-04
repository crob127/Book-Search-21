const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
const { ApolloServer } = require('apollo-server-express');
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
      console.log("Invalid token");
    }
  }
  return {};
};

// Apollo Server set up
const server = new ApolloServer({
  typeDefs,
  resolvers,
  constext: ({ req }) => {
    const auth = authenticate(req);
    return { ...auth };
  },
});

server.start().then(() => {
  server.applyMiddleware({ app });

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json);

  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

  app.use(routes);

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(`GraphQL available at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
});





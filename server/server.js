const express = require('express');
const path = require('path');
const db = require('./config/connection');
// const routes = require('./routes');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4')
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

mongoose.connect('mongodb+srv://crob127: Oukv8pmUFqQg6Bga@cluster0.wpvt8.mongodb.net/BookSearchDB?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Apollo Server set up
const server = new ApolloServer({
  typeDefs,
  resolvers,
  constext: ({ req }) => {
    const auth = authenticate(req);
    return { ...auth };
  },
});

const startApolloServer = async () => {
  await server.start();
  
  // app.use(express.urlencoded({ extended: true }));
  // app.use(express.json());
  
  app.use('/graphql', expressMiddleware(server));

  // if we're in production, serve client/dist as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/build'));
    });
  } 

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

startApolloServer();
// server.start().then(() => {
//   server.applyMiddleware({ app });

//   app.use(express.urlencoded({ extended: true }));
//   app.use(express.json);

//   // if we're in production, serve client/build as static assets
//   if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, '../client/build')));
//   }

//   app.use(routes);

//   db.once('open', () => {
//     app.listen(PORT, () => {
//       console.log(`🌍 Now listening on localhost:${PORT}`);
//       console.log(`GraphQL available at http://localhost:${PORT}${server.graphqlPath}`);
//     });
//   });
// });
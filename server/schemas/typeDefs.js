const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Book {
        _id: ID
        title: String
        author: String
        description: String
        image: String
        link: String
    }

    type User {
        _id: ID
        username: String
        email: String
        savedBooks: [Book]
    }

    type Query {
        books: [Book]
        book(id: ID!): Book
        me: User
    }

    type Mutation {
        addUser(username: STRING! email: String!, passowrd: String!): User
        login(email: String!, password: String!): String
        saveBook(bookId: ID!): User
        removeBook(bookId: ID!): User
    }
`;

module.exports = typeDefs;
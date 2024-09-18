const { AuthenticationError } = require('@apollo/server/errors');
const { User, Book } = require('../models');
const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'mysecret';

const resolvers = {
    Query: {
        books: async () => {
            return Book.findById(id);
        },
        book: async (parent, { id }) => {
            return Book.findById(id);
        },
        me: async (parent, args, { user }) => {
            if (!user) {
                throw new AuthenticationError("Please log in");
            }
            return User.findById(user._id).populate('savedBooks');
        },
    },

    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = jwt.sign({ _id: user._id, email: user.email }, secret, {expiresIn: '2h' });
            return { token, user };
        },
        
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if(!user) {
                throw new AuthenticationError("Incorrect credentials");
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError("Incorrect credentials");
            }

            const token = jwt.sign({ _id: user._id, email: user.email }, secret, { expiresIn: '2h' });
            return { token, user };
        },

        saveBook: async (parent, { bookData }, { user }) => {
            if (!user) {
                throw new AuthenticationError("You must be logged in to save books");
            }

            return User.findByIdAndUpdate(
                user._id,
                { $addToSet: { savedBooks: bookData } },
                { new: true, runValidators: true }
            ).populate('savedBooks');
        },

        removeBook: async (parent, { bookId }, { user }) => {
            if (!user) {
                throw new AuthenticationError('You must be logged in');
            }

            return User.findByIdAndUpdate(
                user._id,
                { $pull: { savedBooks: { _id: bookId } } },
                { new: true }
            ).populate('savedBooks');
        },
    },
};

module.exports = resolvers;
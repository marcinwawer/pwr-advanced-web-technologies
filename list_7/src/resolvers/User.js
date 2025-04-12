const { ApolloError } = require('apollo-server-errors');
const { Todo } = require('../models');

const User = {
    todos: async (parent) => {
        try {
            return await Todo.find({ userId: parent._id });
        } catch (error) {
            throw new ApolloError("error fetching todo for user: " + error.message);
        }
    }
};

module.exports = User;
const { ApolloError } = require('apollo-server-errors');
const { User } = require('../models');

const Todo = {
    user: async (parent) => {
        try {
            return await User.findOne({ _id: parent.userId });
        } catch (error) {
            throw new ApolloError("error fetching user for todo: " + error.message);
        }
    }
};

module.exports = Todo;
const { ApolloError, UserInputError } = require('apollo-server-errors');
const { User, Todo } = require('../models');

const Query = {
    users: async () => {
        try {
            return await User.find().populate('todos');
        } catch (error) {
            throw new ApolloError("error fetching users: " + error.message);
        }
    },
    user: async (parent, { id }) => {
        try {
            if (!id || id.trim() === '') {
            throw new UserInputError("incorrect user id");
            }

            const user = await User.findOne({ _id: Number(id) }).populate('todos');
            if (!user) {
            throw new UserInputError(`user with id ${id} not found`);
            }

            return user;
        } catch (error) {
            if (error instanceof UserInputError) {
                throw error;
            }

            throw new ApolloError("error fetching user: " + error.message);
        }
    },
    todos: async () => {
        try {
            return await Todo.find().populate('user');
        } catch (error) {
            throw new ApolloError("error fetching user: " + error.message);
        }
    },
    todo: async (parent, { id }) => {
        try {
            if (!id || id.trim() === '') {
                throw new UserInputError("incorrect todo id");
            }

            const todo = await Todo.findOne({ _id: Number(id) }).populate('user');
            if (!todo) {
                throw new UserInputError(`todo with id ${id} not found`);
            }

            return todo;
        } catch (error) {
            if (error instanceof UserInputError) {
                throw error;
            }
                
            throw new ApolloError("error fetching todo: " + error.message);
        }
    }
};

module.exports = Query;
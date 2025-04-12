const { ApolloError, UserInputError } = require('apollo-server-errors');
const { Todo } = require('../models');
const { syncTodosFromREST, syncUsersFromREST } = require('../sync/syncFunctions');

const Mutation = {
    syncTodos: async () => {
        return await syncTodosFromREST();
    },
    syncUsers: async () => {
        return await syncUsersFromREST();
    },
    createTodo: async (parent, { input }) => {
        try {
            if (!input.userId || input.userId.toString().trim() === '') {
                throw new UserInputError("todo must be assigned to a valid user");
            }
            const userId = Number(input.userId);
            
            const existingUser = await User.findOne({ _id: userId });
            if (!existingUser) {
                throw new UserInputError(`user with id ${input.userId} does not exist.`);
            }
            
            const maxTodo = await Todo.findOne().sort({ _id: -1 }).exec();
            const newId = maxTodo ? maxTodo._id + 1 : 1;
        
            const newTodoData = {
                _id: newId,
                title: input.title,
                completed: input.completed,
                userId: Number(input.userId) 
            };
        
            const newTodo = await Todo.create(newTodoData);
            return newTodo;
        } catch (error) {
            throw new ApolloError("error creating todo: " + error.message);
        }
    },
    updateTodo: async (parent, { id, input }) => {
        try {
            if (!id || id.trim() === '') {
                throw new UserInputError("incorrect todo id");
            }

            const updatedTodo = await Todo.findOneAndUpdate(
                { _id: Number(id) },
                input,
                { new: true, runValidators: true }
            );

            if (!updatedTodo) {
                throw new UserInputError(`todo with id ${id} not found`);
            }

            return updatedTodo;
        } catch (error) {
            if (error && error.name === 'UserInputError') {
                throw error;
            }

            throw new ApolloError("error updating todo: " + error.message);
        }
    },
    deleteTodo: async (parent, { id }) => {
        try {
            if (!id || id.trim() === '') {
                throw new UserInputError("incorrect todo id");
            }

            const deletedTodo = await Todo.findOneAndDelete({ _id: Number(id) });

            if (!deletedTodo) {
                throw new UserInputError(`todo with id ${id} not found`);
            }

            return deletedTodo;
        } catch (error) {
            if (error && error.name === 'UserInputError') {
                throw error;
            }

            throw new ApolloError("error deleting todo: " + error.message);
        }
    }   
};

module.exports = Mutation;
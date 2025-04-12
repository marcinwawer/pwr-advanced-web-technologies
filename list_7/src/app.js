const { createYoga, createSchema } = require('graphql-yoga');
const mongoose = require('mongoose');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { ApolloError, UserInputError } = require('apollo-server-errors')
const { User, Todo } = require('./models');

async function syncTodosFromREST() {
    try {
        const response = await axios.get("https://jsonplaceholder.typicode.com/todos");
        const todosData = response.data;

        for (const extTodo of todosData) {
        await Todo.findOneAndUpdate(
            { _id: extTodo.id },
            {
            title: extTodo.title,
            completed: extTodo.completed,
            userId: extTodo.userId
            },
            { upsert: true, new: true, runValidators: true }
        );
        }

        return "todos sync success";
    } catch (error) {
        throw new ApolloError("todos sync error: " + error.message);
    }
}

async function syncUsersFromREST() {
    try {
        const resUsers = await axios.get("https://jsonplaceholder.typicode.com/users");
        const usersData = resUsers.data;

        for (const extUser of usersData) {
            await User.findOneAndUpdate(
                { _id: extUser.id },
                {
                name: extUser.name,
                email: extUser.email,
                login: extUser.username
                },
                { upsert: true, new: true, runValidators: true }
            );
        }

        return "users sync success";
    } catch (error) {
        throw new ApolloError("users sync error: " + error.message);
    }
}

const resolvers = {
    Query: {
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
  },

    User: {
        todos: async (parent) => {
            try {
                return await Todo.find({ userId: parent._id });
            } catch (error) {
                throw new ApolloError("error fetching todo for user: " + error.message);
            }
        }
    },

    Todo: {
        user: async (parent) => {
            try {
                return await User.findOne({ _id: parent.userId });
            } catch (error) {
                throw new ApolloError("error fetching user for todo: " + error.message);
            }
        }
    },
  
    Mutation: {
        syncTodos: async () => {
            return await syncTodosFromREST();
        },
        syncUsers: async () => {
            return await syncUsersFromREST();
        }
    }
};

(async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/graphQLDB');
        console.log("connected to mongodb");

        const typeDefs = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8');
        const schema = createSchema({
            typeDefs,
            resolvers,
        });

        const yoga = createYoga({
            schema,
            maskedErrors: false,
            formatError: (err) => {
                return err; 
            }
        });
        const httpServer = http.createServer(yoga);

        httpServer.listen(4000, () => {
            console.log("graphql server running on: http://localhost:4000");
        });

    } catch (error) {
        console.error("error initializing graphql server", error);
    }
})();
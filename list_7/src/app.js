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
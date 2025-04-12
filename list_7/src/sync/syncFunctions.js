const axios = require('axios');
const { ApolloError } = require('apollo-server-errors');
const { User, Todo } = require('../models');

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

module.exports = { syncTodosFromREST, syncUsersFromREST };
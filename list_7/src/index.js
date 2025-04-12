const { createYoga, createSchema } = require('graphql-yoga');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const http = require('http');
const resolvers = require('./resolvers');

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
            formatError: (err) => err,
        });

        const httpServer = http.createServer(yoga);
        httpServer.listen(4000, () => {
            console.log("graphql server running on: http://localhost:4000");
        });
    } catch (error) {
        console.error("error initializing graphql server", error);
    }
})();
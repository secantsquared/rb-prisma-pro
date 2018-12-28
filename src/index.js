import '@babel/polyfill'
require('dotenv').config({
    path: '/Users/rb/Documents/rb-prisma-pro/config/dev.env'
})
import { GraphQLServer, PubSub } from 'graphql-yoga'
import { resolvers, fragmentReplacements } from './resolvers/index'
import prisma from './prisma'

const pubsub = new PubSub()

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context(request) {
        return {
            pubsub,
            prisma,
            request
        }
    },
    fragmentReplacements
})

server.start({ port: process.env.PORT || 4000 }, () => {
    console.log('Server is running!')
})

import Fastify from 'fastify';
import greetingsController from './greetings-controller.js';
import fastifyMysql from '@fastify/mysql';
import booksController from './books-controller.js';

// after impoting a plugin like this, you must register it with fastify
// using fastify.register(greetingsController) and the you can give it a prefix
// as to where you want the route to be available form


const fastify = Fastify({
    logger: true //easily log the fastify server
})

//register the connection of the database that is on the host with the user
fastify.register(fastifyMysql, {
    host: 'localhost',
    user: 'root',
    database: 'bookstore',
    promise: true,
})


fastify.register(greetingsController, { prefix: '/greetings' })

fastify.register(booksController, { prefix: '/books' })


// after initializing and starting, lets define an end point

//set a get method on the route route, and set a call back handler 
// with a request and reply object 


fastify.get('/', (req, rep) => {
    //tell fastify what to return
    return{
        message: 'Hello World!'
    }
})

// after this when you add script to start in package.json and run npm run start 
// the server runs and logs the message in the client/browser


// now, let us try fastify.route. fastify.roue that has a return of a route, 
// does the same as fastiify.route. but it allows you to it lets you configure 
// everything about a route in one object.
// * When you start needing:
// * multiple HTTP methods,
// * schema validation, //We can also define a json schema for every part of the request and the response
// * hooks (before/after),
// * preHandlers (auth),
// * config options,
// * tags/descriptions for Swagger,

fastify.route({
    method: 'GET',
    url: '/hello/:name',
    schema: {
        querystring: {
            properties: {
                lastname: {type: 'string'}
            },
            required: [ 'lastname' ]
        },
        params: {
            properties: {
                name: {type: 'string'}
            },
            required: [ 'name' ]
        },
        response: {
            200: {
                properties: {
                    message: {type: 'string'}
                },
                required: [ 'message' ]
            }
        }
    },
    handler: (req, res) => {
        return {
            message: `Hello ${req.params.name}, ${req.query.lastname}`
        };
    }
})


//if we want to use any database in the app, or lets say with fastify, we first install the database
// npm install -s @fastify/mysql


try {
    fastify.listen({port: 3002})
} catch (error) {
    fastify.log.error(error) //easy fastify method to handle error
    process.exit(1) //on error stop the node app with exit code 1
}


import { responseSchema } from './schema.js';

//in your controller you bassically need three arguments, 
// which are fastify, options and done 
// and thats how you defien a fastify plugin 
// you have to call done when the plugin finishes all its operations

//then we can define our routes inside the controller

//then you can use the response schema in both of the endpoints

const greetingsController = (fastify, options, done) => {

    //http://localhost:3002/greetings/work
    fastify.get('/work', {schema: responseSchema}, (req, rep) => {
        //tell fastify what to retrun
        return{
            message: 'Hello World from greetings controller!'
        }
    });

    //http://localhost:3002/greetings/hello/name
    fastify.get('/hello/:name', {schema: responseSchema}, (req, rep) => {
        //tell fastify what to retrun
        return{
            message: `Hello ${req.params.name} from greetings controller!`
        }
    })

    done()
}

// now you have to import this controller into your server
export default greetingsController;
import { bookPostSchema, booksResponseSchema } from "./schema.js";

const booksController = (fastify, options, done) => {
    fastify.get('/', {schema: booksResponseSchema}, async (req, reply) => {
        try {
            const [books] = await fastify.mysql.execute('select * from books');
            return {books};
        } catch (error) {
            return(error);
        }
    });

    fastify.post('/', {schema: bookPostSchema},async(req, reply) => {
        try {
            const { book } = req.body;
            await fastify.mysql.execute(`
                INSERT INTO books (title, author) VALUES (? , ?)
                `, [book.title, book.author]);
            return{status: 200};
        } catch (error) {
            return(error);
        }
    });

    done();
}

export default booksController;
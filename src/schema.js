
//we can create a response schema, which can then be passed into the controller
//Response schema
// Validates what your API returns to the frontend.

//required shouldn't be in the properties, it should be outside
export const responseSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        message: { type: 'string'}
      },
      required: ['message']
    }
  }
};

export const booksResponseSchema = {
  response: {
    200: {
      books: {type: 'array'}
    }
  }
}

export const bookPostSchema = {
  body: {
    properties: {
      book: {type: 'object'}
    },
    required: ['book']
  },
  response: {
    200: {
      status: {type: 'number'}
    }
  }
}

apart from .get 

## 🧠 1. The main HTTP methods Fastify supports

Just like in Express or other web frameworks, Fastify follows standard **HTTP verbs** for different kinds of actions:

| Method       | Typical Use                                             | Example                    |
| ------------ | ------------------------------------------------------- | -------------------------- |
| `.get()`     | Retrieve data                                           | Get a list of users        |
| `.post()`    | Create new data                                         | Create a new user          |
| `.put()`     | Replace or update existing data                         | Update a full user record  |
| `.patch()`   | Partially update data                                   | Update only a user’s email |
| `.delete()`  | Remove data                                             | Delete a user              |
| `.options()` | Check what methods are allowed (used by CORS preflight) | CORS                       |
| `.head()`    | Same as GET but without body (for checking headers)     | Metadata only              |
| `.all()`     | Handle all methods for a route                          | Debugging or fallback      |

All of these work exactly like `.get()`, but they correspond to different request types.

---

## 🧩 2. Common route method examples

### ✅ `fastify.get()`

For fetching or reading data.

```js
fastify.get('/users', async (req, reply) => {
	return [{ id: 1, name: 'Azeez' }];
});
```

➡️ Used by frontend when requesting data (e.g., via `fetch('/users')`)

---

### ✅ `fastify.post()`

For creating a new resource.

```js
fastify.post('/users', async (req, reply) => {
	const { name } = req.body;
	return { message: `User ${name} created!` };
});
```

➡️ The client sends JSON or form data to create something new.

Example frontend call:

```js
fetch('/users', {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ name: 'Azeez' })
});
```

---

### ✅ `fastify.put()`

For replacing (updating) a full record.

```js
fastify.put('/users/:id', async (req, reply) => {
	const { id } = req.params;
	const updatedUser = req.body;
	return { message: `User ${id} replaced`, data: updatedUser };
});
```

➡️ Typically used when you overwrite all fields of an existing resource.

---

### ✅ `fastify.patch()`

For *partially* updating a resource.

```js
fastify.patch('/users/:id', async (req, reply) => {
	const { id } = req.params;
	const updates = req.body;
	return { message: `User ${id} updated`, changes: updates };
});
```

➡️ Example: changing only a password or email, not the whole user.

---

### ✅ `fastify.delete()`

For deleting resources.

```js
fastify.delete('/users/:id', async (req, reply) => {
	const { id } = req.params;
	return { message: `User ${id} deleted` };
});
```

➡️ Example: removing a user, product, or post.

---

### ✅ `fastify.options()`

For handling browser “preflight” CORS requests manually (usually handled by `@fastify/cors`).

```js
fastify.options('/users', async (req, reply) => {
	reply
		.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
		.send();
});
```

---

### ✅ `fastify.head()`

For requesting just the headers of a resource (no body).

```js
fastify.head('/status', async (req, reply) => {
	reply.header('X-App-Status', 'Running').send();
});
```

---

### ✅ `fastify.all()`

Handles *any* HTTP method for the same route.

```js
fastify.all('/ping', async (req, reply) => {
	return { method: req.method, message: 'pong' };
});
```

➡️ Useful for debugging, fallback routes, or when you don’t care which method is used.

---

## 🧠 3. Advanced — route registration with `fastify.route()`

Instead of using `.get()`, `.post()`, etc., you can define all routes using **one unified syntax**:

```js
fastify.route({
	method: 'POST',
	url: '/login',
	schema: {
		body: {
			type: 'object',
			required: ['username', 'password'],
			properties: {
				username: { type: 'string' },
				password: { type: 'string' },
			},
		},
	},
	handler: async (req, reply) => {
		return { message: 'Logged in successfully' };
	},
});
```

➡️ This is useful for dynamic routes or plugin-based setups.

---

## ⚙️ 4. Summary

| Method       | Purpose               | Example route |
| ------------ | --------------------- | ------------- |
| `.get()`     | Retrieve data         | `/users`      |
| `.post()`    | Create data           | `/users`      |
| `.put()`     | Replace full record   | `/users/:id`  |
| `.patch()`   | Update partial record | `/users/:id`  |
| `.delete()`  | Delete record         | `/users/:id`  |
| `.options()` | Preflight / config    | `/users`      |
| `.head()`    | Headers only          | `/status`     |
| `.all()`     | Handle all methods    | `/debug`      |

---

## ✅ 5. Which one “connects to the frontend”?

They **all** can — depending on what the frontend needs.

For example:

* Frontend uses **GET** to fetch posts or products
* Uses **POST** to create an account
* Uses **PUT** or **PATCH** to update profile data
* Uses **DELETE** to remove an item

These routes are all **API endpoints** that your frontend communicates with via `fetch()` or Axios.

---

### 💬 In one sentence:

> Fastify supports all standard HTTP methods — `.get()`, `.post()`, `.put()`, `.patch()`, `.delete()`, `.options()`, `.head()`, and `.all()` — each matching a specific type of frontend action (reading, creating, updating, or deleting data).

---

Would you like me to show you a **full CRUD API example** using all these methods together (for a `users` or `items` endpoint)? It’ll make everything click visually.


***********************************************************************

what other returns does fastify.send return


## 🧠 1. The basics — what happens when you `return {}`

When you write:

```js
fastify.get('/', async (req, reply) => {
	return { message: 'Hello World!' }
});
```

Fastify automatically:

1. Detects that you returned a **plain JavaScript object**
2. Serializes it as **JSON**
3. Sends it with HTTP **status code 200**

That’s the most common pattern for API routes. ✅

Response sent:

```json
{
  "message": "Hello World!"
}
```

---

## 🧩 2. What else you can return (or send)

Fastify supports multiple return types and response styles. Let’s go through each 👇

---

### 🧱 a) **Plain Object** → JSON (most common)

```js
return { user: 'Azeez', role: 'admin' }
```

➡️ Automatically serialized to JSON
➡️ Sets `Content-Type: application/json`

---

### 🧱 b) **String** → Plain text

```js
return 'Hello, world!';
```

➡️ Sent as plain text (`Content-Type: text/plain`)
➡️ Useful for simple health checks or debug responses

---

### 🧱 c) **Buffer** → Binary data

```js
import fs from 'fs';

fastify.get('/logo', async () => {
	return fs.readFileSync('./public/logo.png');
});
```

➡️ Fastify sends it as a binary stream
➡️ Sets `Content-Type` automatically if known (or you can set it manually)

---

### 🧱 d) **Stream** → File or data streams

```js
import fs from 'fs';

fastify.get('/download', async () => {
	return fs.createReadStream('./files/report.pdf');
});
```

➡️ Streamed efficiently without loading entire file into memory
➡️ Best for large files, videos, or audio

---

### 🧱 e) **Manually use `reply.send()`**

Instead of returning a value, you can explicitly send it:

```js
fastify.get('/', (req, reply) => {
	reply.send({ msg: 'Hello via send()' });
});
```

✅ Equivalent to returning an object, but lets you control **status codes** and **headers** more precisely.

---

### 🧱 f) **Send status codes**

You can chain methods with `reply`:

```js
fastify.get('/created', (req, reply) => {
	reply.code(201).send({ message: 'Resource created!' });
});
```

➡️ Response:

```http
HTTP/1.1 201 Created
Content-Type: application/json
{"message":"Resource created!"}
```

---

### 🧱 g) **Redirect**

```js
fastify.get('/old-route', (req, reply) => {
	reply.redirect('/new-route');
});
```

➡️ Sends an HTTP 302 redirect (or you can specify another code, e.g. `301`)

---

### 🧱 h) **Custom headers**

```js
fastify.get('/headers', (req, reply) => {
	reply
		.header('X-Custom-Header', 'FastifyRocks')
		.code(200)
		.send({ ok: true });
});
```

---

### 🧱 i) **Set cookies (when using fastify-cookie)**

```js
fastify.get('/login', (req, reply) => {
	reply
		.setCookie('session', 'abc123', { httpOnly: true, path: '/' })
		.send({ loggedIn: true });
});
```

---

### 🧱 j) **HTML response**

Fastify doesn’t auto-detect HTML, but you can easily send it:

```js
fastify.get('/page', (req, reply) => {
	reply.type('text/html').send(`
		<!DOCTYPE html>
		<html><body><h1>Hello, World!</h1></body></html>
	`);
});
```

➡️ Sets `Content-Type: text/html`

You can also use templating plugins (like `@fastify/view`) for full HTML rendering.

---

### 🧱 k) **File via `reply.sendFile()` (with @fastify/static)**

```js
fastify.get('/home', (req, reply) => {
	reply.sendFile('index.html');
});
```

➡️ Serves a static file from your configured static folder
➡️ Fast and memory-safe

---

### 🧱 l) **Error responses**

You can return or throw errors — Fastify handles them gracefully:

```js
throw new Error('Something went wrong');
```

or:

```js
return reply.code(400).send({ error: 'Bad request' });
```

Fastify will automatically format the error as JSON unless you override it.

---

## 🧭 3. Summary table

| What you return           | Content-Type       | Description             |
| ------------------------- | ------------------ | ----------------------- |
| `{}` (object)             | `application/json` | Auto JSON serialization |
| `"string"`                | `text/plain`       | Plain text              |
| `Buffer`                  | auto-detected      | Binary data             |
| `Stream`                  | auto-detected      | File or streaming data  |
| `reply.send()`            | depends on value   | Manual send             |
| `reply.code(x)`           | any                | Set HTTP status         |
| `reply.redirect(url)`     | `text/plain`       | HTTP redirect           |
| `reply.type('text/html')` | custom             | Set custom MIME type    |
| `reply.setCookie()`       | +cookie header     | Add cookies             |
| `throw new Error()`       | JSON error         | Automatic error handler |

---

## 💡 4. When to use which

| Use Case               | Best Method                                          |
| ---------------------- | ---------------------------------------------------- |
| API response (JSON)    | `return {}`                                          |
| Error or custom status | `reply.code().send()`                                |
| File or download       | `return fs.createReadStream()` or `reply.sendFile()` |
| Redirect               | `reply.redirect()`                                   |
| HTML page              | `reply.type('text/html').send()`                     |
| Cookies or headers     | `reply.setCookie()`, `reply.header()`                |

---

### 💬 In one sentence:

> In Fastify, you can return plain objects (for JSON APIs), strings, buffers, or streams — or use the `reply` object to send custom responses, headers, cookies, redirects, or files — depending on what your route needs to do.

***********************************************************************

does fastify.get that has a return of a route, do the same as fastiify.route


💯 Excellent — this is exactly the kind of deeper architecture question that shows you’re thinking beyond just “making it work” and actually understanding how Fastify behaves under the hood. 👏

Let’s go step by step to clarify how `fastify.get()` compares to `fastify.route()` — and when they’re equivalent vs when they differ.

---

## 🧠 1. The short answer

> ✅ **Yes** — `fastify.get()` is just a *shortcut* (alias) for `fastify.route({ method: 'GET', ... })`.

They both register the **same type of route internally** in Fastify.

So these two are functionally identical:

```js
// Shortcut form
fastify.get('/hello', async (req, reply) => {
	return { message: 'Hello!' };
});

// Long form
fastify.route({
	method: 'GET',
	url: '/hello',
	handler: async (req, reply) => {
		return { message: 'Hello!' };
	},
});
```

Both will:

* listen on `GET /hello`
* respond with `{ "message": "Hello!" }`
* appear the same in Swagger docs
* behave identically in logs and performance

---

## 🧩 2. So why does `fastify.route()` exist?

Because `fastify.route()` is **more powerful and flexible** —
it lets you configure *everything about a route in one object.*

When you start needing:

* multiple HTTP methods,
* schema validation,
* hooks (before/after),
* preHandlers (auth),
* config options,
* tags/descriptions for Swagger,

then `fastify.route()` becomes much more readable and maintainable.

---

### Example: simple route (using `.get()`)

```js
fastify.get('/users', async (req, reply) => {
	return [{ id: 1, name: 'Azeez' }];
});
```

### Equivalent (using `.route()`)

```js
fastify.route({
	method: 'GET',
	url: '/users',
	schema: {
		description: 'Get all users',
		tags: ['Users'],
		response: {
			200: {
				type: 'array',
				items: { type: 'object', properties: { id: { type: 'integer' }, name: { type: 'string' } } },
			},
		},
	},
	preHandler: async (req, reply) => {
		console.log('Checking authentication...');
	},
	handler: async (req, reply) => {
		return [{ id: 1, name: 'Azeez' }];
	},
});
```

---

## ⚙️ 3. Think of `.get()` as syntactic sugar

You can think of `.get()` as shorthand:

```js
fastify.get(path, [options], handler);
```

Which internally translates to:

```js
fastify.route({
	method: 'GET',
	url: path,
	...options,
	handler,
});
```

So internally, Fastify just calls `.route()` behind the scenes.

---

## 🧾 4. When to use which

| Use Case                                                  | Recommended                          |
| --------------------------------------------------------- | ------------------------------------ |
| Simple one-liner routes                                   | ✅ `.get()` / `.post()` / `.delete()` |
| Routes with schema, hooks, configs                        | ✅ `.route()`                         |
| Programmatically defining routes (loops, dynamic methods) | ✅ `.route()`                         |
| Swagger + detailed configs                                | ✅ `.route()`                         |
| Quick prototyping                                         | `.get()` is fine                     |
| Large APIs (REST, modular structure)                      | `.route()` is cleaner                |

---

## 🧱 5. Real-world example: CRUD API using both styles

```js
// Shorthand routes
fastify.get('/items', getItems);
fastify.post('/items', addItem);
fastify.delete('/items/:id', deleteItem);

// Same using route()
fastify.route({
	method: 'PUT',
	url: '/items/:id',
	schema: {
		body: {
			type: 'object',
			required: ['name'],
			properties: { name: { type: 'string' } },
		},
	},
	handler: updateItem,
});
```

Both styles can coexist perfectly fine in one Fastify app.

---

## 🧠 6. Developer analogy

* **`.get()`** → quick and simple: “Register a GET route at this URL.”
* **`.route()`** → full configuration: “Register a route with this method, schema, hooks, and metadata.”

---

## ✅ 7. Summary

| Feature          | `fastify.get()`           | `fastify.route()`                  |
| ---------------- | ------------------------- | ---------------------------------- |
| Simplicity       | ✅ Easiest to write        | Slightly more verbose              |
| Power            | Limited to simple handler | Full control (schema, hooks, etc.) |
| Swagger support  | Via `schema` param        | Full schema integration            |
| Multiple methods | ❌ One per call            | ✅ You choose any HTTP method       |
| Under the hood   | Calls `fastify.route()`   | Base route method                  |

---

### 💬 In one sentence:

> `fastify.get()` is just a shorthand for `fastify.route({ method: 'GET', ... })`,
> but `fastify.route()` gives you full control over schemas, hooks, configs, and advanced route setup — so use it when you need richer configuration or want cleaner large-scale APIs.


***********************************************************************

# ✅ **Fastify Request Schema Types (Full List)**

A Fastify route can have **8 different request-related schemas**, plus documentation schemas.

## **1. `body` Schema**

Validates the JSON body for POST, PUT, PATCH.

Example:

```js
body: {
  type: 'object',
  required: ['name'],
  properties: {
    name: { type: 'string' },
    email: { type: 'string', format: 'email' }
  }
}
```

---

## **2. `params` Schema**

Validates **URL parameters** like `/users/:id`.

Example:

```js
params: {
  type: 'object',
  properties: {
    id: { type: 'string' }
  }
}
```

---

## **3. `querystring` Schema**

Validates **query parameters** like `/users?limit=10`.

Example:

```js
querystring: {
  type: 'object',
  properties: {
    limit: { type: 'number' },
    page: { type: 'number' }
  }
}
```

---

## **4. `headers` Schema**

Validates request headers.

Example:

```js
headers: {
  type: 'object',
  properties: {
    authorization: { type: 'string' }
  },
  required: ['authorization']
}
```

---

## **5. `cookies` Schema**

(*Only if using `@fastify/cookie`*)

Example:

```js
cookies: {
  type: 'object',
  properties: {
    sessionId: { type: 'string' }
  },
  required: ['sessionId']
}
```

---

## **6. `formBody` Schema**

(Alias for urlencoded form data)

Used when you submit `application/x-www-form-urlencoded`.

```js
formBody: {
  type: 'object',
  properties: {
    title: { type: 'string' },
    content: { type: 'string' }
  }
}
```

---

## **7. `body` with multipart (files)**

When using `@fastify/multipart`, Fastify treats file fields differently.

You can still validate the text fields:

```js
body: {
  type: 'object',
  properties: {
    description: { type: 'string' }
  }
}
```

File validation happens in your handler.

---

## **8. `response` Schema**

Validates WHAT YOU RETURN to the client.

Example:

```js
response: {
  200: {
    type: 'object',
    properties: {
      id: { type: 'number' },
      name: { type: 'string' }
    }
  }
}
```

This ensures your controllers always return valid data.

---

# 🟦 **Documentation-Only Schema Fields (for Swagger)**

These do *not* validate data, but provide metadata.

## **9. `description`**

Long description.

```js
description: "Create a new user"
```

## **10. `summary`**

Short description.

```js
summary: "User creation route"
```

## **11. `tags`**

Groups routes into categories in Swagger UI.

```js
tags: ["Users"]
```

## **12. `deprecated`**

```js
deprecated: true
```

## **13. `security`**

Defines custom security requirements (e.g. JWT).

```js
security: [
  { bearerAuth: [] }
]
```

## **14. `externalDocs`**

Link external documentation.

```js
externalDocs: {
  url: "https://docs.myapi.com",
  description: "More info"
}
```

---

# 🟩 The **full schema object** you can use

Here is everything combined:

```js
const schema = {
  description: "Get a user",
  summary: "Fetch user",
  tags: ["Users"],
  deprecated: false,

  params: {
    type: "object",
    properties: {
      id: { type: "string" }
    }
  },

  querystring: {
    type: "object",
    properties: {
      includePosts: { type: "boolean" }
    }
  },

  headers: {
    type: "object",
    properties: {
      authorization: { type: "string" }
    },
    required: ["authorization"]
  },

  body: {
    type: "object",
    properties: {
      username: { type: "string" }
    }
  },

  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" }
      }
    }
  }
}
```

---

# 🚀 Example route using separate schema

```js
fastify.get('/users/:id', { schema }, async (req, reply) => {
  return { id: req.params.id, name: 'Azeez' }
});
```

---

# 🧠 Summary Table

| Schema Key      | Purpose                          |
| --------------- | -------------------------------- |
| **body**        | Validate JSON body               |
| **params**      | Validate `/route/:id` parameters |
| **querystring** | Validate `?key=value`            |
| **headers**     | Validate request headers         |
| **cookies**     | Validate cookies                 |
| **formBody**    | Validate form-urlencoded         |
| **response**    | Validate server responses        |
| description     | Swagger                          |
| summary         | Swagger                          |
| tags            | Swagger                          |
| deprecated      | Swagger                          |
| security        | Swagger                          |
| externalDocs    | Swagger                          |


***********************************************************************

# ✅ **1. Basic Response Schema (Simple Object)**

```js
const schema = {
  response: {
    200: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    }
  }
};
```

### Route

```js
fastify.get('/hello', { schema }, async () => {
  return { message: "Hello World!" };
});
```

---

# ✅ **2. Response With Required Fields**

```js
response: {
  200: {
    type: 'object',
    required: ['success'],
    properties: {
      success: { type: 'boolean' },
      data: { type: 'object' }
    }
  }
}
```

If you forget `success` in your returned object, Fastify will throw a validation error.

---

# ✅ **3. Array Response Schema**

Example: list of users.

```js
response: {
  200: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        name: { type: 'string' }
      }
    }
  }
}
```

### Route

```js
fastify.get('/users', { schema }, async () => {
  return [
    { id: 1, name: "Azeez" },
    { id: 2, name: "John" }
  ];
});
```

---

# ✅ **4. Nested Objects**

```js
response: {
  200: {
    type: 'object',
    properties: {
      user: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          profile: {
            type: 'object',
            properties: {
              age: { type: 'number' },
              country: { type: 'string' }
            }
          }
        }
      }
    }
  }
}
```

---

# ✅ **5. Response With Different Status Codes**

Fastify allows **different schemas for each status code**.

```js
response: {
  200: {
    type: 'object',
    properties: {
      message: { type: 'string' }
    }
  },
  400: {
    type: 'object',
    properties: {
      error: { type: 'string' }
    }
  }
}
```

---

# ✅ **6. Response With OneOf / AnyOf (Returning Two Shapes)**

Example: Sometimes the API returns a user; sometimes null.

```js
response: {
  200: {
    oneOf: [
      {
        type: 'object',
        properties: {
          id: { type: 'number' },
          name: { type: 'string' }
        }
      },
      {
        type: 'null'
      }
    ]
  }
}
```

---

# ✅ **7. Response With Pagination Example**

Common in real APIs:

```js
response: {
  200: {
    type: 'object',
    properties: {
      total: { type: 'number' },
      page: { type: 'number' },
      items: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            title: { type: 'string' }
          }
        }
      }
    }
  }
}
```

---

# ✅ **8. File Download Response**

When returning a file, you usually skip validation:

```js
response: {
  200: {
    type: 'string',
    format: 'binary'
  }
}
```

---

# ✅ **9. Common API Response Format**

Many APIs use a shared structure like:

```js
response: {
  200: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' },
      data: { type: 'object' }
    }
  }
}
```

---

# 🎯 **10. Example: Complete CRUD Response Schemas**

Full example for `"users"` endpoint.

```js
export const userResponseSchemas = {
  listUsers: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "number" },
          name: { type: "string" },
        }
      }
    }
  },

  getUser: {
    200: {
      type: "object",
      properties: {
        id: { type: "number" },
        name: { type: "string" },
        email: { type: "string" }
      }
    },
    404: {
      type: "object",
      properties: {
        error: { type: "string" }
      }
    }
  },

  createUser: {
    201: {
      type: "object",
      properties: {
        id: { type: "number" },
        name: { type: "string" },
        email: { type: "string" }
      }
    }
  }
};
```

---

# 🧠 How Fastify Uses These Schemas

Fastify does **two things** with response schemas:

### 1. **Validation**

If your controller returns a value that *does not match* the schema → Fastify throws an error.

### 2. **Fast JSON Serialization**

Fastify compiles a JSON serializer function **ahead of time**, making responses faster than `JSON.stringify()`.

---

# 📌 How to Apply the Response Schema to a Route

```js
fastify.get('/users', {
  schema: {
    response: userResponseSchemas.listUsers
  }
}, async () => {
  return [{ id: 1, name: "Azeez" }];
});
```

---

# 📦 Full Example: Using Response Schema + Controller

### user.schemas.js

```js
export const getUserResponse = {
  200: {
    type: 'object',
    properties: {
      id: { type: 'number' },
      name: { type: 'string' }
    }
  }
};
```

### user.routes.js

```js
import { getUserResponse } from './user.schemas.js';

fastify.get('/users/:id', {
  schema: {
    response: getUserResponse
  }
}, userController.getUser);
```

---

# 🎉 Summary: Types of Fastify Response Schemas

You can define response schemas for:

* simple objects
* arrays
* nested objects
* different status codes
* file responses
* paginated responses
* oneOf / multiple shapes
* shared API structure
* CRUD patterns

Fastify uses them for:

* serialization (speed)
* validation (correctness)
* documentation (Swagger)


***********************************************************************


# ✅ **Response Schemas start with status codes**

inside a Fastify `response` schema object, each **key must be a status code**:

```js
response: {
  200: { ... },
  201: { ... },
  400: { ... },
  404: { ... }
}
```

This is required because **Fastify can validate different responses for different status codes**.

---

# 🧠 **Why does Fastify require status codes?**

Because different status codes often return **different shapes**.

Example:

### ✔ Successful response (200)

```json
{
  "id": 1,
  "name": "Azeez"
}
```

### ❌ Error response (404)

```json
{
  "error": "User not found"
}
```

Fastify needs to know:

* what your `200` response should look like
* what your `404` response should look like
* and validate them separately

If you didn’t specify the status code, Fastify would not know which schema to enforce.

---

# 💡 **Think of it like this:**

```js
response: {
   STATUS_CODE: SCHEMA
}
```

Each response status code has its own **schema rules**.

---

# 🧱 **Examples of response schemas**

## 1️⃣ **Single status code**

```js
response: {
  200: {
    type: "object",
    properties: {
      message: { type: "string" }
    }
  }
}
```

---

## 2️⃣ **Multiple status codes**

```js
response: {
  200: {
    type: "object",
    properties: {
      id: { type: "number" },
      name: { type: "string" }
    }
  },
  404: {
    type: "object",
    properties: {
      error: { type: "string" }
    }
  }
}
```

---

## 3️⃣ **Different schemas for success vs error**

```js
response: {
  201: {
    type: "object",
    properties: {
      success: { type: "boolean" },
      id: { type: "number" }
    }
  },
  400: {
    type: "object",
    properties: {
      error: { type: "string" }
    }
  }
}
```

---

## 4️⃣ **Optional: wildcard status code**

You can also use `'default'` if you want the same schema for ANY response:

```js
response: {
  default: {
    type: "object",
    properties: {
      message: { type: "string" }
    }
  }
}
```

But most APIs don’t use this — explicit status codes are better.

---

# 🎯 **Common mistake**

❌ Developers sometimes write:

```js
response: {
   type: "object",
   properties: { ... }
}
```

This is **wrong** in Fastify because the `response` object MUST contain status codes.

Correct:

```js
response: {
  200: {
    type: "object",
    properties: { ... }
  }
}
```

---

# 🧠 **Fastify validates based on the actual response code**

Example:

```js
reply.code(201).send({ id: 1 });
```

Fastify will check:

```
response[201]
```

If your handler uses:

```js
reply.code(404).send({ error: "Not found" });
```

Fastify checks:

```
response[404]
```

This is why it MUST start with status codes.

***********************************************************************
***********************************************************************
***********************************************************************
***********************************************************************
***********************************************************************
***********************************************************************
***********************************************************************
***********************************************************************
***********************************************************************
***********************************************************************
***********************************************************************
***********************************************************************
***********************************************************************
***********************************************************************

const path = require("path");
const FileSync = require("lowdb/adapters/FileSync");
const lodashId = require("lodash-id");
const lowdb = require("lowdb");

const http = require("http");

const PORT = 4040;

const server = http.createServer((request, response) => {
  if (request.url.startsWith("/posts")) {
    // use the request method to access the corresponding handler
    const handler = HANDLERS[request.method];

    // if the handler function exists,
    if (handler) {
      // handle the request and response
      handler(request, response);
    } else {
      // if request method not found in the HANDLERS object,
      notFound(response);
    }
  } else {
    // if request url doesn't start with "/posts",
    notFound(response);
  }
});

server.listen(PORT);
console.log(`Listening on port ${PORT}`);

const HANDLERS = {
  // notice the capitalization!
  POST(request, response) {
    // construct contents of request data
    let contents = "";
    request.on("data", chunk => (contents += chunk));

    request.on("end", () => {
      // create/write new post in the db
      const post = db
        .get("posts")
        .insert({ body: contents })
        .write();
      // send ok response with constructed post data
      ok(response, post);
    });
    // use internal server error response if error interrupts request
    request.on("error", () => internalServerError(response));
  },
  GET(request, response) {
    const posts = db.get("posts");

    if (request.url === "/posts") {
      // only send back the entire collection when the URL matches /posts exactly
      ok(response, { posts: posts.value() });
    } else {
      // otherwise, split up the url by '/' to try to find a post ID
      const parts = request.url.split("/");

      // TODO: explore better ways to do this!
      if (parts.length === 3) {
        const id = parts.pop();
        const post = posts.getById(id).value();

        // if a post exists with that ID,
        if (post) {
          ok(response, post);
        } else {
          // if no post found with that ID,
          notFound(response);
        }
      } else {
        // if more than 3 parts to the request url,
        notFound(response);
      }
    }
  },
  PATCH(request, response) {
    const parts = request.url.split("/");

    // as before, we can search the URL for an id...
    if (parts.length === 3) {
      // ...and construct the contents of the request data
      let contents = "";
      request.on("data", chunk => (contents += chunk));

      request.on("end", () => {
        const id = parts.pop();

        // updateById returns a post only if one already exists with that ID
        const post = db
          .get("posts")
          .updateById(id, { body: contents })
          .write();

        if (post) {
          ok(response, post);
        } else {
          notFound(response);
        }
      });

      request.on("error", () => internalServerError(response));
    } else {
      notFound(response);
    }
  },
  DELETE(request, response) {
    const parts = request.url.split("/");

    if (parts.length === 3) {
      const id = parts.pop();
      // like updateById, removeById will only return a post if a post exists with that ID
      const post = db
        .get("posts")
        .removeById(id)
        .write();

      if (post) {
        ok(response, post);
      } else {
        notFound(response);
      }
    } else {
      notFound(response);
    }
  }
};

// use FileSync to create an adapter linked to a .json file
const adapter = new FileSync(path.join(__dirname, "db.json"));
// create a lowdb database and link it to the .json file
const db = lowdb(adapter);
// utilize lodashId to auto-generate unique IDs for our db entries
db._.mixin(lodashId);
// create a collection for blog posts and write it to the db
db.defaults({ posts: [] }).write();

const notFound = response => {
  response.writeHead(404);
  response.write(JSON.stringify({ message: "Not Found" }));
  response.end();
};

const internalServerError = response => {
  response.writeHead(500);
  response.write(JSON.stringify({ message: "Internal Server Error" }));
  response.end();
};

const ok = (response, payload) => {
  response.writeHead(200);
  response.write(JSON.stringify(payload));
  response.end();
};

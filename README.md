# Graphql server and client for blog app

A full-fledged Apollo Server 2 with Apollo Client 2 blog app with React, Express and PostgreSQL. 

## Features

* React (create-react-app) with Apollo Client 2
  * Queries, Mutations
* Node.js with Express and Apollo Server 2
  * cursor-based Pagination
* PostgreSQL or Sqlite Database with Sequelize
  * entities: users
* Authentication
  * powered by JWT and local storage
  * Sign Up, Sign In, Sign Out
* Authorization
  * protected endpoint (e.g. verify valid session)
  * protected resolvers (e.g. e.g. session-based, role-based)
  * protected routes (e.g. session-based, role-based)
* performance optimizations
  * example of using Facebook's dataloader
* E2E testing

## Enhancement

* Implement the tag create mutation.
* Add tags field to include posts id.
* Markdown editor has the limit of input words. (Implement the more flexible editor of markdown.)
* The landing page doesn't refetch the posts after submit mutation query to the server.
* Integrate the UI repository.

### Client

* `cd client`
* `npm install`
* `npm start`
* visit `http://localhost:3000`

### Server

* `touch .env`
* `npm install`
* fill out *.env file* (see below)
* `npm start`
* optional visit `http://localhost:8000` for GraphQL playground

#### .env file

```
// If database not set that will use the sqlite3
DATABASE=mydatabase
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
// SECRET is required 
SECRET=asdlplplfwfwefwekwself.2342.dawasdq
```

The `SECRET` is just a random string for your authentication. Keep all these information secure by adding the *.env* file to your *.gitignore* file. No third-party should have access to this information.

#### Testing

* adjust `test-server` npm script with `TEST_DATABASE` environment variable in package.json to match your testing database name
  * to match it from package.json: `createdb mytestdatabase` with psql
* one terminal: npm run test-server
* second terminal: npm run test


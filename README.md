# Postgres Setup on MacOS

Homebrew for installing and managing your applications on MacOS. Afterward, you can update all your Homebrew dependencies and install PostgresSQL on the command line: 
```bash
% brew update
% brew install postgresql
```
Then you can check your PostgreSQL version on command line:
```bash
% postgres --version
postgres (PostgreSQL) 10.3
```

# Setting up PostgreSQL as physical Database

Therefore, create the default postgres database on the command line in case it didn't happen automatically for you:
```bash
% initdb /user/local/var/postgres
```
You can manually `start and stop your Postgres` database server with the following commands on the command line:
```bash
% pg_ctl -D /usr/local/var/postgres start
% pg_ctl -D /usr/local/vat/postgres stop
```

# Creating your PostgreSQL Database

Setup up actual database which can be used in your app.
```bash
createdb mydatabasename
dropdb mhydatabasename
```
Use `psql` command works for you or you have to specify a database such as the default postgres database in order to connect to it.

```bash
psql postgres
```
Being in the `psql` shell, you can create and drop databases too:
```
CREATE DATABASE mydatabasename;
DROP DATABASE mydatabasename;
```
you can type `\list` to list all your databases.

# A minimal Postgres with Sequelize in Express Setup.

`Sequelize` is such an `ORM` which supports multiple dialects whereas PostgreSQL is one of those dialects. In general, Sequelize will give you a comfortable API to work with your actual PostgreSQL database from setup to execution.

Install sequelize and pg (postgres client for Node.js) on th cmd by using npm:
```bash
npm install pg sequelize --save
```
Create a folder `src/models/` in to store Node.js application. Its content are files for each model in your database (`src/models/author.js` and `src/models/tweet.js`). Moreover, there is one file (`src/models/index.js`) which combines all models and exports all the necessary information to the Express server.

Create Author model could look like the following:
```js
const author = (sequelize, DataTypes) => {
  const Author = sequelize.define('author', {
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
  });

  Author.associate = models => {
    Author.hasMany(models.Tweet);
  };

  return Author;
};

export default author;
```
And the Tweet model looks quite similar to it:
```js
const tweet = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('tweet', {
    text: DataTypes.STRING,
  });

  Tweet.associate = models => {
    Tweet.belongsTo(models.Author);
  };

  return Tweet;
};

export default tweet;
```
Furthermore, the associate property is used to create relations between models. Whereas an Author can have multiple Tweets, a Tweet belongs to only one Author. For dive deeper into these things by reading up the [Sequelize documentation](http://docs.sequelizejs.com/). Then create a `src/models/index.js` file, you import and combine those models and resolve their associations by using the Sequelize API:
```js
import Sequelize from 'sequelize';

const sequelize = new Sequelize('twitter', 'postgres', 'postgres', {
  dialect: 'postgres',
});

const models = {
  Author: sequelize.import('./author'),
  Tweet: sequelize.import('./tweet'),
};

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
```
For instance, you have to tell Sequelize the dialect of your database which is postgres and not mysql or sqlite.
```bash
CREATE USER postgres WITH SUPERUSER PASSWORD 'postgres';
```
Created Sequelizee instance in your Express application:
```js
import express from 'express';
...
// here you have your express related imports
...

import models from './models';

const app = express();

...
// here you do your express server setup
...

models.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Your Server is up and running');
  });
});
```
Once you start your application again, you should see on the command line thar the tables in your database got created.

# Apollo Server Setup with Express

In this application, you will use `Express`, because it is the most popular and commonly used middleware library for Node.js. So let's install these two dependencies to the package.json file and node_module folder:
```bash
npm install apollo-server apollo-server-express --save 
```
Apart from these libraries for Apollo Server, you will need the core libraries for Express and GraphQL:
```bash
npm install express graphql --save
```
Get started with the source code in the `src/index.js` file. First, import the necessary parts for getting started with Apollo Server in Express:
```js
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
```
And second, you can use the both imports for initializing your Apollo Server with Express:
```js
import express from 'express';
import { ApolloServer } from 'apollo-server-express';

const app = express();

const schema = ...
const resolvers = ...

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});
```

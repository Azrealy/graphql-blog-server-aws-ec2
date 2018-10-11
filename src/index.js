import 'dotenv/config';
import http from 'http';
import cors from 'cors';
import express from 'express';
import jwt from 'jsonwebtoken';
import DataLoader from 'dataloader';
import { ApolloServer } from 'apollo-server-express';
import { AuthenticationError } from 'apollo-server';
import readFiles from "./readFiles";

import schema from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';
import loaders from './loaders';
import fs from "fs";

const app = express();

app.use(cors());

const getMe = async req => {
  const token = req.headers['x-token'];

  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError(
        'Your session expired. Sign in again.',
      );
    }
  }
};

const server = new ApolloServer({
  introspection: true,
  typeDefs: schema,
  resolvers,
  formatError: error => {
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '');

    return {
      ...error,
      message,
    };
  },
  context: async ({ req }) => {
    const me = await getMe(req);

    return {
      models,
      me,
      secret: process.env.SECRET,
      loaders: {
        user: new DataLoader(keys =>
          loaders.user.batchUsers(keys, models),
        ),
      },
    };
  },
});

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const isTest = !!process.env.TEST_DATABASE;
const isProduction = !!process.env.DATABASE_URL || !process.env.DATABASE;
const port = process.env.PORT || 8000;

sequelize.sync({ force: isTest || isProduction }).then(async () => {
  if (isTest || isProduction) {
    createUsersWithMessages(new Date());
  }

  httpServer.listen({ port }, () => {
    console.log(` Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`)
    console.log(`Apollo Server on http://localhost:${port}/graphql`);
  });
});

const createUsersWithMessages = async date => {

  const tags = [{
      id: 1,
      name: "Python"
    }, {
      id: 2,
      name: "Webpack"
    },{
      id: 3,
      name: "Deploy"
    },{
      id: 4,
      name: "React"
    },{
      id: 5,
      name: "English"
    }, {
      id: 6,
      name: "Nodejs"
    }, {
      id: 7,
      name: "Gatsby"
    }, {
      id: 8,
      name: "JWT"
    }, {
      id: 9,
      name: "Japanese"
    }, {
      id: 10,
      name: "Postgres"
    }]

  await tags.forEach(async tag => await models.Tag.create(tag))

  await readFiles('blogs', tags)

  await models.User.create(
    {
      username: 'aliceice',
      email: 'fangkaihang1992@yahoo.co.jp',
      password: '1234qwer',
      role: 'ADMIN',
    },
  );

  await models.User.create(
    {
      username: 'backupaccount',
      email: 'aliceworld@david.com',
      password: 'alice1234',
    },
  );
};

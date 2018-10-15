import 'dotenv/config';
import http from 'http';
import cors from 'cors';
import express from 'express';
import jwt from 'jsonwebtoken';
import DataLoader from 'dataloader';
import { ApolloServer } from 'apollo-server-express';
import { AuthenticationError } from 'apollo-server';
import fileList from "./fileList";

import schema from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';
import loaders from './loaders';

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
const isDevelopment = !process.env.DATABASE;
const isProduction = !!process.env.DATABASE_URL;
const port = process.env.PORT || 8000;

sequelize.sync({ force: isTest || isDevelopment }).then(async () => {
  if (isTest || isDevelopment) {
    await createPosts();
    await createUsers();
    console.log('Default user been create...')
  }

  if (isProduction) {
    await createPosts();
    console.log('Production model has been set.')
  }

  httpServer.listen({ port }, () => {
    console.log(` Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`)
    console.log(`Apollo Server on http://localhost:${port}/graphql`);
  });
});

const createPosts = async () => {

  const posts = await fileList('blogs')

  await posts.forEach(async post => {
    const result = await models.Post.create(post.markdown)
    await result.setTags(post.tagIds)
  })
};

const createUsers = async () => {

  await models.User.create(
    {
      username: 'george',
      email: 'fangkaihang1992@yahoo.co.jp',
      password: 'georgepassword',
      role: 'ADMIN',
    },
  );
}

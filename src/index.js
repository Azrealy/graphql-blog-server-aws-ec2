import 'dotenv/config';
import http from 'http';
import cors from 'cors';
import express from 'express';
import jwt from 'jsonwebtoken';
import DataLoader from 'dataloader';
import { ApolloServer } from 'apollo-server-express';
import { AuthenticationError } from 'apollo-server';
import storeMarkdown from "./storeMarkdown";

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

var webpackContent = fs.readFileSync('./webpack-post.md', 'utf8');
var tornadoContent = fs.readFileSync('./tornado-post.md', 'utf8');
var envContent = fs.readFileSync('./using-react-env.md', 'utf8')
const createUsersWithMessages = async date => {
  await models.Tag.create({
    id: 1,
    name: "python"
  })
  await models.Tag.create({
    id: 2,
    name: "webpack",
  })

  const tags = [{
    id: 1,
    name: "python"
  }, {
    id: 2,
    name: "webpack"
  }]

  await storeMarkdown('./tutorial.md', date, models, tags)

  const post1 = await models.Post.create(
    {
      title: 'Webpack 4 tutorial',
      description: 'Webpack 4 has **a massive performance improvement** as zero configure module bundler.',
      image: "https://scontent-nrt1-1.xx.fbcdn.net/v/t1.0-9/42090761_1727426667356171_3308341453305937920_o.jpg?_nc_cat=110&oh=67b704d0607d274c8066aa8926689835&oe=5C5D6B55",
      content: webpackContent,
      createdAt: date.setSeconds(date.getSeconds() + 1),
    }
  )
  await post1.setTags([10])

  const post2 = await models.Post.create(
    {
      title: 'Deep understanding python asynchronous programming of tornado',
      description: 'Thoroughly understand what, why, and how asynchronous programming is. And learning the basic concept of`tornado` asynchronous programming.',
      image: "https://scontent-nrt1-1.xx.fbcdn.net/v/t1.0-9/41026193_1712817715483733_4509720973674545152_o.jpg?_nc_cat=101&oh=8f4a327f0a5ac4cc4f1309bbeebc0be8&oe=5C226087",
      content: tornadoContent,
      createdAt: date.setSeconds(date.getSeconds() + 1)
    }
  )
  await post2.setTags([11, 10])


  const post3 = await models.Post.create(
    {
      title: 'Deep understanding python asynchronous programming of tornado',
      description: 'Thoroughly understand what, why, and how asynchronous programming is. And learning the basic concept of`tornado` asynchronous programming.',
      image: "https://scontent-nrt1-1.xx.fbcdn.net/v/t1.0-9/43331094_2191437827736847_713655545474580480_n.jpg?_nc_cat=101&oh=b9c40d086667dfe7975533a9dcfa25db&oe=5C46B86A",
      content: envContent,
      createdAt: date.setSeconds(date.getSeconds() + 1)
    }
  )
  await post3.setTags([11, 10])

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

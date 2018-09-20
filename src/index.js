import 'dotenv/config';
import express from 'express';
import jwt from 'jsonwebtoken';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import DataLoader from 'dataloader';
import schema from './schema';
import resolvers from './resolvers';
import http from 'http';
import loaders from './loaders';
import models, { sequelize } from './models';

const app = express();

const getMe = async (req) => {
    const token = req.headers['x-token']

    if (token) {
        try {
            return await jwt.verify(token, process.env.SECRETE)
        } catch (e) {
            throw new AuthenticationError(
                'Your session expired, Sign in again.'
            )
        }
    }
}

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  formatError: error => {
    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '');

    return {
      ...error,
      message,
    };
  },
  context: async ({ req, connection }) => {
      if (connection) {
          return {
              models
          }
      }
      if (req) {
        const me = await getMe(req)
        return {
            models,
            me: me,
            secret: process.env.SECRETE,
            user: new DataLoader(keys =>
                loaders.user.batchUsers(keys, models)),
        }
        }   
    },
  }
);

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = http.createServer(app)
server.installSubscriptionHandlers(httpServer)

const eraseDatabaseOnSync = true;

const isTest = !!process.env.TEST_DATABASE

sequelize.sync({ force: isTest }).then(async () =>{
  if (isTest) {
      createUsersWithMessages(new Date());
    }
  httpServer.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
  })
});
const createUsersWithMessages = async (date) => {
    await models.User.create(
      {
        username: 'k-fang',
        email: 'k-fang@yahoo.co.jp',
        password: '1234qwer',
        role: 'ADMIN',
        messages: [
          {
            text: 'Published the Road to learn React',
            createdAt: date.setSeconds(date.getSeconds() + 1),
          },
        ],
      },
      {
        include: [models.Message],
      },
    );
  
    await models.User.create(
      {
        username: 'alice',
        email: 'alice@yahoo.co.jp',
        password: 'alicepass',
        messages: [
          {
            text: 'Happy to release ...',
            createdAt: date.setSeconds(date.getSeconds() + 1),
          },
          {
            text: 'Published a complete ...',
            createdAt: date.setSeconds(date.getSeconds() + 1),
          },
        ],
      },
      {
        include: [models.Message],
      },
    );
  };
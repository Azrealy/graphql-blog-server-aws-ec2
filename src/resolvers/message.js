import { combineResolvers } from 'graphql-resolvers';
import Sequelize from 'sequelize';
import pubsub, { EVENTS } from '../subscription';
import { isAuthenticated, isMessageOwner } from './authorization';

const date = new Date()
export default {
  Query: {
    messages: async (parent, { cursor, limit = 100 }, { models }) => {
        const cursorOptions = cursor
          ? {
              where: {
                createdAt: {
                  [Sequelize.Op.lt]: cursor,
                },
              },
            }
          : {};
  
        const messages = await models.Message.findAll({
          order: [['createdAt', 'DESC']],
          limit: limit + 1,
          ...cursorOptions,
        });
        const hasNextPage = messages.length > limit
        const edges = hasNextPage ? messages.slice(0, -1) : messages
  
        return {
          edges: edges,
          pageInfo: {
            hasNextPage: hasNextPage,
            endCursor: messages[messages.length - 1].createdAt,
          },
        };
      },
    message: async (parent, { id }, { models }) => {
        return await models.Message.findById(id);
      },
  },

  Mutation: {
    createMessage: combineResolvers(
        isAuthenticated,
        async (parent, { text }, { me, models }) => {
            try {
                const message = await models.Message.create({
                text,
                userId: me.id,
                createdAt: date.setSeconds(date.getSeconds() + 1),
                });
                pubsub.publish(EVENTS.MESSAGE.CREATED, {
                    messageCreated: { message }
                })

                return message
            } catch (error) {
                throw new Error(error)
            } 
      },
    ),
    deleteMessage: combineResolvers(
        isAuthenticated,
        isMessageOwner,
        async (parent, { id }, { models }) => {
            return await models.Message.destroy({ where: { id } });
        },
    ),
    updateMessage: combineResolvers(
        isAuthenticated,
        isMessageOwner, 
        async (parent, { id, text }, { models }) => {
        const array = await models.Message.update({ text }, { where: { id } });
        if (array[0] === 1) {
            return true
        } else {
            return false
        }
    }
    )
  },

  Message: {
    user: async (message, args, { loaders }) => {
        return await loaders.user.load(message.userId);
    },
  },
  Subscription: {
      messageCreated: {
          subscribe: () => pubsub.asyncIterator(EVENTS.MESSAGE.CREATED),
      }
  }
};
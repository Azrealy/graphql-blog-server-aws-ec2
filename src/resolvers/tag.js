import { isAdmin } from './authorization';
import { combineResolvers } from 'graphql-resolvers';

export default {
    Query: {
        tags: async (parent, args, { models }) => {
            return await models.Tag.findAll()
        },
        tag: async (parent, { id }, { models }) => {
            return await models.Tag.findById(id)
        }
    },
    Mutation: {
        addTag: combineResolvers(
            isAdmin,
            async (parent, { name }, { models }) => {
                return await models.Tag.create({
                    name
                })
            }
        ),

        deleteTag: combineResolvers(
            isAdmin,
            async (parent, { id }, { models }) => {
                const tag = await models.Tag.findById(id);
                return await tag.destroy()
            }
        )
    },
    Tag: {
        posts: async (tag, args, { models }) => {
            return await tag.getPosts()
        }
    },
}
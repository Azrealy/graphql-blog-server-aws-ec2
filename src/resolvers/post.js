import Sequelize from 'sequelize';
import { isAdmin } from './authorization';
import { combineResolvers } from 'graphql-resolvers';

export default {
    Query: {
        posts: async (parent, { cursor, limit = 10 }, { models }) => {
            const cursorOptions = cursor
            ? {
                where: {
                  createdAt: {
                    [Sequelize.Op.lt]: cursor,
                  },
                },
              }
            : {};
            const posts = await models.Post.findAll({
                order: [['createdAt', 'DESC']],
                limit: limit + 1,
                ...cursorOptions
            })

            const hasNextPage = posts.length > limit
            const edges = hasNextPage ? posts.slice(0, -1) : posts

            return {
                edges: edges,
                postInfo: {
                    hasNextPage: hasNextPage,
                    endCursor: edges[edges.length - 1].createdAt,
                }
            }

        },
        post: async (parent, { id }, { models }) => {
            return await models.Post.findById(id);
        }
    },

    Mutation: {
        createPost: combineResolvers(
            isAdmin,
            async (parent, { title, description, image, content, tags }, { models } ) => {
                const date = new Date()
                const post = await models.Post.create({
                    title: title,
                    description: description,
                    image: image,
                    content: content,
                    createdAt: date.setSeconds(date.getSeconds() + 1)
                    })
                await post.setTags(tags);

                return post
            },            
        ),

        deletePost: combineResolvers(
            isAdmin,
            async (parent, { id }, { models }) => {
            return await models.Post.destroy({  where: { id } })
        }),

        updatePost: combineResolvers(
            isAdmin,
            async (parent, { id, title, description, image, content, tags}, { models }) => {
                const post = await models.Post.findById(id);
    
                await post.update({ 
                    title,
                    description,
                    image,
                    content
                 })
                
                await post.setTags(tags);
    
                return post;
            }
        )
    },
    Post: {
        tags: async (post, args, { models }) => {
            return await post.getTags();
        }
    }
}
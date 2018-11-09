import Sequelize from 'sequelize';
import { isAdmin } from './authorization';
import { combineResolvers } from 'graphql-resolvers';

export default {
    Query: {
        posts: async (parent, { forward, cursor, limit = 10 }, { models }) => {
            const orderCursorOptions = forward ?
              {
                where: {
                  createdAt: {
                    [Sequelize.Op.gt]: cursor,
                  },
                },
              } : {
                where: {
                  createdAt: {
                    [Sequelize.Op.lt]: cursor,
                  },
                },
              }
            const cursorOptions = cursor
            ? {
                ...orderCursorOptions
            }
            : {};
            const orderOption = forward ? 
              { order: [['createdAt', 'ASC']] } : {order: [['createdAt', 'DESC']]}
            const posts = await models.Post.findAll({
              ...orderOption,
              limit: limit + 1,
              ...cursorOptions
            })

            const hasNextPage = posts.length > limit
            const edges = hasNextPage ? posts.slice(0, -1) : posts

            return {
                edges: edges.sort((a, b) => b.createdAt - a.createdAt ),
                postInfo: {
                    hasNextPage: hasNextPage,
                    startCursor: edges[0].createdAt,
                    endCursor: edges[edges.length - 1].createdAt,
                    count: await models.Post.count()
                }
            }

        },
        post: async (parent, { filename, id }, { models }) => {
            if (filename) {
                return await models.Post.findOne({ where: {filename: filename}});
            } 
            if (id) {
                return await models.Post.findById(id)
            } else {
                return null
            }
            
        }
    },

    Mutation: {
        createPost: combineResolvers(
            isAdmin,
            async (parent, { filename, title, description, image, content, tags }, { models } ) => {
                const date = new Date()
                const post = await models.Post.create({
                    filename: filename,
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
            async (parent, { id, filename, title, description, image, content, tags}, { models }) => {
                const post = await models.Post.findById(id);
    
                await post.update({
                    filename,
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
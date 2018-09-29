import Sequelize from 'sequelize';


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
        createPost: async (parent, { title, description, content, tags }, { models } ) => {
            const date = new Date()
            const post = await models.Post.create({
                title: title,
                description: description,
                content: content,
                createdAt: date.setSeconds(date.getSeconds() + 1)
                })
            await post.setTags(tags);

            return post
        },
        deletePost: async (parent, { id }, { models }) => {
            return await models.Post.destroy({  where: { id } })
        },
        updatePost: async (parent, { id, title, description, content, tags}, { models }) => {
            const post = await models.Post.findById(id);

            await post.update({ 
                title,
                description,
                content
             })
            
            await post.setTags(tags);

            return post;
        }
    },
    Post: {
        tags: async (post, args, { models }) => {
            return await post.getTags();
        }
    }
}
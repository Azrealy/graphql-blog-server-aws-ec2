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
            console.log(posts.length - 1)
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

    Post: {
        tags: async (post, args, { models }) => {
            return await models.Tag.findAll({
                where: {
                    postId: post.id,
                }
            })
        }
    }
}
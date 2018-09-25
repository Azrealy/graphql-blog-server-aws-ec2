import Sequelize from 'sequelize';

let date = new Date()
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

    Mutation: {
        createPost: async (parent, { title, description, text, tags }, { models } ) => {
            const post = await models.Post.create(
                {
                  title: title,
                  description: description,
                  text: text,
                  createdAt: date.setSeconds(date.getSeconds() + 1),
                  tags: tags.map((tag)  => ({
                     text: tag,
                     createdAt: date.setSeconds(date.getSeconds() + 1),
                  }))
                },
                {
                  include: [models.Tag],
                }
              )
            return post
        },
        deletePost: async (parent, { id }, { models }) => {
            return await models.Post.destroy({  where: { id } })
        },
        updatePost: async (parent, { id, title, description, text, tags}, { models }) => {
            const update = await models.Post.update({ 
                title,
                description,
                text,
                tags: tags.map((tag) => ({
                    text: tag,
                    createdAt: date.setSeconds(date.getSeconds() + 1),
                }))
             }, { where: { id } })

            if (update[0] === 1) {
                return true
            } else {
                return false
            }
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
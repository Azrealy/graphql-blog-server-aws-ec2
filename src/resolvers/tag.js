
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
        addTag: async (parent, { name }, { models }) => {
            return await models.Tag.create({
                name
            })
        },
        deleteTag: async (parent, { id }, { models }) => {
            const tag = await models.Tag.findById(id);
            return await tag.destroy()
        }
    },
    Tag: {
        posts: async (tag, args, { models }) => {
            return await tag.getPosts()
        }
    },
}
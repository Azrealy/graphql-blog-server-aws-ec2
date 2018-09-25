
export default {
    Query: {
        tags: async (parent, args, { models }) => {
            return await models.Tag.findAll()
        },
        tag: async (parent, { id }, { models }) => {
            return await models.Tag.findById(id)
        }
    },

}
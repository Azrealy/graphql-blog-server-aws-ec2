const post = (sequelize, DataTypes) => {
    const Post = sequelize.define('post', {
      title: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: 'Post title can not be empty',
          }
        }
      },
      description: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: 'Post description can not be empty',
          }
        }
      },

      content: {
        type: DataTypes.STRING(2000) ,
        validate: { notEmpty: {
                args:true,
                msg: 'Content can not be empty'
            }
        },
      },
      createdAt: {
        type: DataTypes.INTEGER ,
      }
    });
  
    Post.associate = models => {
      Post.belongsToMany(models.Tag, { through: 'post_tag' });
    };
  
    return Post;
  };
  
  export default post;
const post = (sequelize, DataTypes) => {
    const Post = sequelize.define('post', {
      filename: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          notEmpty: {
            args: true,
            msg: 'Post markdown file name can no be empty.',
          }
        }
      },
      title: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: 'Post title can not be empty.',
          }
        }
      },
      description: {
        type: DataTypes.TEXT,
        validate: {
          notEmpty: {
            args: true,
            msg: 'Post description can not be empty',
          }
        }
      },
      image: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: 'Post image link can not be empty',
          }
        }
      },

      content: {
        type: DataTypes.TEXT,
        validate: { notEmpty: {
                args:true,
                msg: 'Content can not be empty'
            }
        },
      },
      createdAt: {
        type: DataTypes.STRING,
      }
    });
  
    Post.associate = models => {
      Post.belongsToMany(models.Tag, { through: 'post_tag' });
    };
  
    return Post;
  };
  
  export default post;

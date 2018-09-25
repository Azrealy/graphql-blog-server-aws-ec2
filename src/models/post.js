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

      text: {
        type: DataTypes.STRING,
        validate: { notEmpty: {
                args:true,
                msg: 'Text can not be empty'
            }
        },
      },
      createdAt: {
        type: DataTypes.STRING,
      }
    });
  
    Post.associate = models => {
      Post.hasMany(models.Tag, { onDelete: 'CASCADE' });
    };
  
    return Post;
  };
  
  export default post;
const tag = (sequelize, DataTypes) => {
    const Tag = sequelize.define('tag', {
      name: {
        type: DataTypes.STRING,
        validate: { notEmpty: {
                args:true,
                msg: 'Tag can not be empty'
            }
        },
      }
    });

    Tag.associate = models => {
      Tag.belongsToMany(models.Post, { through: 'post_tag' });
    };

    return Tag;
  };
  
  export default tag;
const tag = (sequelize, DataTypes) => {
    const Tag = sequelize.define('tag', {
      text: {
        type: DataTypes.STRING,
        validate: { notEmpty: {
                args:true,
                msg: 'Tag can not be empty'
            }
        },
      },
      createdAt: {
        type: DataTypes.STRING,
      }
    });
  
    Tag.associate = models => {
      Tag.belongsTo(models.Post);
    };
  
    return Tag;
  };
  
  export default tag;
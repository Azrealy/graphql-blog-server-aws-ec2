const message = (sequelize, DataTypes) => {
    const Message = sequelize.define('message', {
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
  
    Message.associate = models => {
      Message.belongsTo(models.User);
    };
  
    return Message;
  };
  
  export default message;
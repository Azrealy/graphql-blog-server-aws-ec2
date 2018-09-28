const posttag = (sequelize, DataTypes) => {
    const PostTag = sequelize.define('PostTag', {
        postId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        tagId:{
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        }
    });
    return PostTag;
  };
  
  export default posttag;
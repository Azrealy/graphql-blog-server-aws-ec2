import Sequelize from 'sequelize';

const sequelize = new Sequelize(
  process.env.TEST_DATABASE || process.env.DATABASE ,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    // sqlite! now!
    dialect: 'postgres',
  })

const models = {
    User: sequelize.import('./user'),
    Message: sequelize.import('./message'),
  };

Object.keys(models).forEach(key => {
    if ('associate' in models[key]) {
      models[key].associate(models);
    }
  });
export { sequelize };

export default models;
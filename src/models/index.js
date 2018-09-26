import Sequelize from 'sequelize';

let sequelize;
if (process.env.DATABASE_URL) {
  // Production env
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres'
  })
} 
if (process.env.DATABASE) {
  // Postgres env
 sequelize = new Sequelize(
  process.env.TEST_DATABASE || process.env.DATABASE ,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    dialect: 'postgres',
  })
} else {
  // Sqlite env
  sequelize = new Sequelize('sqlite:/tmp/sqlite-db.db')
}

const models = {
    User: sequelize.import('./user'),
    Message: sequelize.import('./message'),
    Tag: sequelize.import('./tag.js'),
    Post: sequelize.import('./post.js')
  };

Object.keys(models).forEach(key => {
    if ('associate' in models[key]) {
      models[key].associate(models);
    }
  });
export { sequelize };

export default models;
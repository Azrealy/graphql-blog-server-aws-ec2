import 'dotenv/config';
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
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    dialect: 'postgres',
  })
} else {
  // Sqlite sql_url = "sqlite:/tmp/sqlite-db.db"
  sequelize = new Sequelize(process.env.TEST_DATABASE)
}

const models = {
    User: sequelize.import('./user'),
    Tag: sequelize.import('./tag.js'),
    Post: sequelize.import('./post.js'),
    PostTag: sequelize.import('./posttag.js')
  };

Object.keys(models).forEach(key => {
    if ('associate' in models[key]) {
      models[key].associate(models);
    }
  });
export { sequelize };

export default models;
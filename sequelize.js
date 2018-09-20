require('dotenv/config')
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
    // sqlite! now!
    dialect: 'postgres',
  })
sequelize.authenticate().then(()=> {
    console.log('connection to postgre sucess')  
}).catch(err=> {
    console.error('Unable to connect to the database:', err)
})
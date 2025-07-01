import { Sequelize } from 'sequelize';
import User from './user.js'
import Build from './build.js'
import { UserFactory } from './user.js';
import { BuildFactory } from './build.js';
import dotenv from 'dotenv'
dotenv.config()

console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: 'localhost',
  dialect: 'postgres',
});

UserFactory(sequelize);
BuildFactory(sequelize);

User.hasMany(Build, { foreignKey: 'userId' });
Build.belongsTo(User, { foreignKey: 'userId' });

export { sequelize, Sequelize, User, Build }
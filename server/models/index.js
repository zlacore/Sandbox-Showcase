import { Sequelize } from 'sequelize';
import User from './user.js'
import Build from './build.js'
import LikedBuild from './likedBuild.js';
import { UserFactory } from './user.js';
import { BuildFactory } from './build.js';
import { CommentFactory } from './comment.js';
import { LikedBuildFactory } from './likedBuild.js';
import dotenv from 'dotenv'
dotenv.config()

console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);

// Use DATABASE_URL if available (common on hosting platforms), otherwise use individual variables
const sequelize = process.env.DATABASE_URL 
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
          require: true,
          rejectUnauthorized: false
        } : false
      }
    })
  : new Sequelize({
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
          require: true,
          rejectUnauthorized: false
        } : false
      }
    });

UserFactory(sequelize);
BuildFactory(sequelize);
CommentFactory(sequelize)
LikedBuildFactory(sequelize)

User.hasMany(Build, { foreignKey: 'user', sourceKey: 'username' });
Build.belongsTo(User, { foreignKey: 'user', targetKey: 'username' });
Build.hasMany(Comment, { foreignKey: 'buildId' });
Comment.belongsTo(Build, { foreignKey: 'buildId' });
User.hasMany(LikedBuild, { foreignKey: 'id'} );
LikedBuild.belongsTo(User, { foreignKey: 'id'})

export { sequelize, Sequelize, User, Build }
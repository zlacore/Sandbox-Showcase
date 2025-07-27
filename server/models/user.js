import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcrypt';
export default class User extends Model {

  async setPassword(password) {
    this.password = await bcrypt.hash(password, 10);
    
  }
  
  async checkPassword(testPassword){
    return bcrypt.compare(testPassword, this.password);
  }
}

export function UserFactory(sequelize) {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },
      // firstName: {
      //   type: DataTypes.STRING,
      // },
      // lastName: {
      //   type: DataTypes.STRING,
      // },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        validate: {
          isEmail: true,
        },
        set(value) {
          this.setDataValue('email', value.toLowerCase());
        }
      },
      password: {
        type: DataTypes.STRING(60),
        allowNull: false,
        validate: {
          len: {
            args: [8, 60],
            msg: 'Password must be between 8 and 60 characters.',
          }
        }
      },
    },
    {
      tableName: 'user',
      sequelize,
      hooks: {
        beforeCreate: async (user) => {
           console.log('beforeCreate hook running');
          if  (user.password && !user.password.startsWith('$2b$') ) {
           user.password = await bcrypt.hash(user.password, 10)
            console.log('password hashed!', user.password)
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed('password') && user.password && !user.password.startsWith('$2b$')) {
            await user.setPassword(user.password);
          }
        },
      },
    }
  );
  
  return User;
}


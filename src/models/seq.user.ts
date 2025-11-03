import { Sequelize, DataTypes } from 'sequelize';
const sequelize = new Sequelize('sqlite::memory:');
import bcrypt  from 'bcrypt';
const User = sequelize.define('user', {
  // Model attributes are defined here
  username: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
    set(value: string) {
      const saltRounds = 10;
      // Storing passwords in plaintext in the database is terrible.
      // Hashing the value with an appropriate cryptographic hash function is better.
      const hashedPassword = bcrypt.hashSync(value, saltRounds);
      this.setDataValue('password', hashedPassword);
    },
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'),
  },
  is_active: {
    type: DataTypes.BOOLEAN,
  },
  jwt_token_version: {
    type: DataTypes.INTEGER,
  },
  first_name: {
    type: DataTypes.STRING,
  },
  last_name: {
    type: DataTypes.STRING,
  },
});

// Sync the model with the database (creates table if it doesn't exist)

export default User;

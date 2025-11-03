import { Sequelize, DataTypes } from 'sequelize';
const sequelize = new Sequelize('sqlite::memory:');
import bcrypt  from 'bcrypt';
const Test = sequelize.define('test', {
  // Model attributes are defined here
  username: {
    type: DataTypes.STRING,
  },
  
  jwt_token_version: {
    type: DataTypes.INTEGER,
  },
});

// Sync the model with the database (creates table if it doesn't exist)
sequelize.sync();

export default Test;

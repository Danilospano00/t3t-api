import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcrypt';
import { sequelize } from '../config/database_config';

// Sync the model with the database (creates table if it doesn't exist)
class User extends Model {
  public id!: string;

  public active!: boolean;
  public apple_provider_id?: string | null;
  public availability?: [string] | null;
  public bio?: string | null;
  public birthdate?: Date | null;

  public categories?: [string] | null;
  public city_id?: number | null;
}

User.init(
  {
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
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at',
  },
);

export default User;

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  /**
   * Up
   */
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";',
    );
    /**
     * Table
     */
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
        type: Sequelize.UUID,
      },
      created_at: {
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        type: Sequelize.DATE,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
      username: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      email: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      role: {
        allowNull: false,
        defaultValue: 'user',
        type: Sequelize.ENUM('user', 'admin'),
      },
      is_active: {
        allowNull: false,
        defaultValue: true,
        type: Sequelize.BOOLEAN,
      },
      jwt_token_version: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1,
      },
      first_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      last_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
    });

    /**
     * Indexes
     */
    await queryInterface.addIndex('users', ['role']);

    await queryInterface.addIndex('users', ['first_name', 'last_name'], {
      name: 'users_name_ilike_idx',
      using: 'BTREE',
      fields: [
        Sequelize.fn('LOWER', Sequelize.col('first_name')),
        Sequelize.fn('LOWER', Sequelize.col('last_name')),
      ],
    });

    // await queryInterface.addIndex('users', ['full_name'], {
    //   name: 'users_full_name_ilike_idx',
    //   using: 'BTREE',
    //   fields: [Sequelize.fn('LOWER', Sequelize.col('full_name'))],
    // });

    await queryInterface.addIndex('users', ['email'], {
      name: 'email_ilike_idx',
      using: 'BTREE',
      fields: [Sequelize.fn('LOWER', Sequelize.col('email'))],
    });
  },

  /**
   * Down
   */
  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, _Sequelize) {
    await queryInterface.dropTable('users');
  },
};

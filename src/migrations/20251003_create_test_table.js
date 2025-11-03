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
    await queryInterface.createTable('test', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
        type: Sequelize.UUID,
      },
      username: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      jwt_token_version: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1,
      },
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

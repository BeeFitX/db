'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('group', {
        id: {
          primaryKey: true,
          type: Sequelize.UUID
        },
        organiser_id: {
          allowNull: false,
          type: Sequelize.UUID
        },
        name: {
          type: Sequelize.STRING,
          unique: true
        },
        slug: {
          type: Sequelize.STRING,
          unique: true
        },
        description: {
          type: Sequelize.TEXT
        },
        url: {
          type: Sequelize.STRING
        },
        profile_picture: {
          type: Sequelize.STRING
        },
        is_active: {
          type: Sequelize.BOOLEAN,
          defaultValue: true
        },
        rating: {
          type: Sequelize.DECIMAL(4, 2),
          defaultValue: 0.0
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal(
            "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
          )
        }
      }, { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('group', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};

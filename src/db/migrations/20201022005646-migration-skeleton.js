'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('event_image', {
        id: {
          primaryKey: true,
          type: Sequelize.UUID
        },
        event_id: {
          primaryKey: true,
          type: Sequelize.UUID
        },
        url: {
          type: Sequelize.STRING,
        },
        type: {
          type: Sequelize.STRING
        },
        is_cover: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        is_active: {
          type: Sequelize.BOOLEAN,
          defaultValue: true
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
      await queryInterface.addConstraint("event_image", {
        fields: ['event_id'],
        type: "foreign key",
        name: "fk_event_image_event_id",
        references: {
          table: "event",
          field: "id"
        },
        onDelete: "cascade",
        onUpdate: "cascade",
        transaction
      })
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('event_image', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};

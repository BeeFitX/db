'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('event_location', {
        id: {
          primaryKey: true,
          type: Sequelize.UUID
        },
        event_id: {
          allowNull: false,
          type: Sequelize.UUID
        },
        country: {
          type: Sequelize.STRING
        },
        address: {
          type: Sequelize.STRING
        },
        building_name: {
          type: Sequelize.STRING
        },
        city: {
          type: Sequelize.STRING
        },
        state: {
          type: Sequelize.STRING
        },
        zipcode: {
          type: Sequelize.INTEGER
        },
        lat: Sequelize.DECIMAL(12, 8),
        lng: Sequelize.DECIMAL(12, 8),
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
      await queryInterface.addConstraint("event_location", {
        fields: ['event_id'],
        type: "foreign key",
        name: "fk_event_location_event_id",
        references: {
          table: "event",
          field: "id"
        },
        onUpdate: "cascade",
        onDelete: "cascade",
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
      await queryInterface.dropTable('event_location', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};

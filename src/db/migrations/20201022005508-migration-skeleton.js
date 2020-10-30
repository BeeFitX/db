'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('venue_location', {
        id: {
          primaryKey: true,
          type: Sequelize.UUID
        },
        venue_id: {
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
      await queryInterface.addConstraint("venue_location", {
        fields: ['venue_id'],
        type: "foreign key",
        name: "fk_venue_location_venue_id",
        references: {
          table: "venue",
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
      await queryInterface.dropTable('venue_location', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};

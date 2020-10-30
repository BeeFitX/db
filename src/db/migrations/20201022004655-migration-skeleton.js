'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('group_location', {
        id: {
          primaryKey: true,
          type: Sequelize.UUID
        },
        group_id: {
          allowNull: false,
          type: Sequelize.UUID
        },
        country: {
          type: Sequelize.STRING
        },
        city: {
          type: Sequelize.STRING
        },
        state: {
          type: Sequelize.STRING
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
      await queryInterface.addConstraint("group_location", {
        fields: ['group_id'],
        type: "foreign key",
        name: "fk_group_location_group_id",
        references: {
          table: "group",
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
      await queryInterface.dropTable('group_location', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};

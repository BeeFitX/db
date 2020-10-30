'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('group_member', {
        group_id: {
          primaryKey: true,
          type: Sequelize.UUID
        },
        member_id: {
          primaryKey: true,
          type: Sequelize.UUID
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
      await queryInterface.addConstraint("group_member", {
        fields: ['group_id'],
        type: "foreign key",
        name: "fk_group_member_group_id",
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
      await queryInterface.dropTable('group_member', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};

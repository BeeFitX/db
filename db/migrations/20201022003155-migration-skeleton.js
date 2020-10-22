'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('event', {
        id: {
          primaryKey: true,
          type: Sequelize.UUID
        },
        group_id: {
          allowNull: false,
          type: Sequelize.UUID
        },
        venue_id: {
          allowNull: true,
          type: Sequelize.UUID
        },
        cover_image_id: {
          allowNull: true,
          type: Sequelize.UUID
        },
        name: {
          type: Sequelize.STRING
        },
        slug: {
          type: Sequelize.STRING
        },
        description: {
          type: Sequelize.TEXT
        },
        url: {
          type: Sequelize.STRING
        },
        duration: {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        head_count: {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        wait_list_count: {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        is_active: {
          type: Sequelize.BOOLEAN,
          defaultValue: true
        },
        date: {
          allowNull: false,
          type: Sequelize.DATEONLY
        },
        time: {
          allowNull: false,
          type: Sequelize.TIME
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
      await queryInterface.addConstraint("event", {
        fields: ['group_id'],
        type: "foreign key",
        name: "fk_event_group_id",
        references: {
          table: "group",
          field: "id"
        },
        onUpdate: "cascade",
        onDelete: "cascade",
        transaction
      })
      await queryInterface.addConstraint("event", {
        fields: ["venue_id"],
        type: "foreign key",
        name: "fk_event_venue_id",
        references: {
          table: "venue",
          field: "id"
        },
        onUpdate: "cascade",
        onDelete: "set null",
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
      await queryInterface.dropTable('event', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};

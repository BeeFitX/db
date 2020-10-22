'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.changeColumn("event", 'status', {
        type: Sequelize.ENUM("created", "cancelled", "published", "pending", "approved", "denied", "past"),
        defaultValue: "created",
        after: 'topic_arn'
      }, { transaction })
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.changeColumn("event", 'status', {
        type: Sequelize.ENUM("created", "cancelled", "published", "pending", "past"),
        defaultValue: "created",
        after: 'topic_arn'
      }, { transaction })
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};

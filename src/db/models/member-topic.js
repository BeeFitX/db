'use strict';

const { Model } = require('sequelize');
const axios = require("axios");

module.exports = (sequelize, DataTypes) => {
  class MemberTopic extends Model {
    static associate(models) {
    }
  };

  MemberTopic.init({
    memberId: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      field: "member_id"
    },
    topicId: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      field: "topic_id"
    },
    subscriptionARN: {
      type: DataTypes.STRING,
      field: "subscription_arn"
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: "created_at",
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: "updated_at",
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'MemberTopic',
  });

  MemberTopic.beforeCreate(async instance => {
    const { Member, Topic } = sequelize.models;
    const member = await Member.findByPk(instance.memberId);
    const topic = await Topic.findByPk(instance.topicId);
    const { data } = await axios.post(
      `${process.env.DOMAIN}/subscribe-to-topic`,
      {
        topicArn: topic.topicARN,
        phoneNumber: member.phoneNumber
      }
    );
    instance.subscriptionARN = data;
  });

  MemberTopic.afterDestroy(async instance => {
    instance.get("subscriptionARN") &&
      (await axios.post(`${process.env.DOMAIN}/unsubscribe-to-topic`, {
        subscriptionArn: instance.get("subscriptionARN")
      }));
  });

  return MemberTopic;
};
'use strict';

const { Model } = require('sequelize');
const axios = require("axios");

module.exports = (sequelize, DataTypes) => {
  class GroupMember extends Model {
    static associate(models) {
    }
  };

  GroupMember.init({
    groupId: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      field: "group_id"
    },
    memberId: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      field: "member_id"
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
    modelName: 'GroupMember',
  });

  GroupMember.beforeCreate(async instance => {
    const { Member, Group } = sequelize.models;
    const member = await Member.findByPk(instance.memberId);
    const group = await Group.findByPk(instance.groupId);
    const { data } = await axios.post(
      `${process.env.DOMAIN}/subscribe-to-topic`,
      {
        topicArn: group.topicARN,
        phoneNumber: member.phoneNumber
      }
    );
    instance.subscriptionARN = data;
  });

  GroupMember.afterDestroy(async instance => {
    instance.get("subscriptionARN") &&
      (await axios.post(`${process.env.DOMAIN}/unsubscribe-to-topic`, {
        subscriptionArn: instance.get("subscriptionARN")
      }));
  });

  return GroupMember;
};
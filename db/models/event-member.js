'use strict';

const { Model } = require('sequelize');
const axios = require("axios");

module.exports = (sequelize, DataTypes) => {
  class EventMember extends Model {
    static associate(models) {
    }
  };

  EventMember.init({
    eventId: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      field: "event_id"
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
    modelName: 'EventMember',
  });

  EventMember.beforeCreate(async instance => {
    const { Event, Member } = sequelize.models;
    const event = await Event.findByPk(instance.eventId);
    const member = await Member.findByPk(instance.memberId);
    const { data } = await axios.post(
      `${process.env.DOMAIN}/subscribe-to-topic`,
      {
        topicArn: event.topicARN,
        phoneNumber: member.phoneNumber
      }
    );
    instance.subscriptionARN = data;
  });

  EventMember.afterDestroy(async instance => {
    instance.get("subscriptionARN") &&
      (await axios.post(`${process.env.DOMAIN}/unsubscribe-to-topic`, {
        subscriptionArn: instance.get("subscriptionARN")
      }));
  });
  
  return EventMember;
};
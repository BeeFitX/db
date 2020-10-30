'use strict';

const { Model } = require('sequelize');
const axios = require("axios");
const crypto = require("crypto");

module.exports = (sequelize, DataTypes) => {
  class Topic extends Model {
    static associate(models) {
      Topic.belongsToMany(models.Group, {
        through: "GroupTopic",
        as: "group",
        foreignKey: "topicId",
        otherKey: "groupId"
      });
    }
  };

  Topic.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      field: "id"
    },
    name: {
      type: DataTypes.STRING(100),
      field: "name",
      unique: true
    },
    slug: {
      type: DataTypes.STRING,
      field: "slug"
    },
    description: {
      type: DataTypes.TEXT,
      field: "description"
    },
    link: {
      type: DataTypes.STRING(100),
      field: "link",
      validate: {
        isUrl: true
      }
    },
    topicARN: {
      type: DataTypes.STRING(100),
      field: "topic_arn"
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "is_active"
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
    modelName: 'Topic',
  });

  Topic.beforeCreate(async instance => {
    const { data } = await axios.post(
      `${process.env.DOMAIN}/create-sns-topic`,
      {
        topic: crypto
          .createHash("sha256")
          .update(instance.slug)
          .digest("hex")
      }
    );
    instance.topicARN = data;
  });

  Topic.beforeUpdate(instance => {
  });

  Topic.afterDestroy(async instance => {
    instance.get("topicARN") &&
      (await axios.post(`${process.env.DOMAIN}/delete-sns-topic`, {
        topicArn: instance.get("topicARN")
      }));
  });

  return Topic;
};
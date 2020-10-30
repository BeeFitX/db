'use strict';

const { Model } = require('sequelize');
const axios = require("axios");
const crypto = require("crypto");
// const { generateSlug } = require(__dirname + '/../helpers/slug-helpers.js')

module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {
        Group.hasOne(models.GroupLocation, {
            as: "location",
            foreignKey: "groupId"
          });
          Group.hasMany(
            models.Event,
            {
              as: "event",
              foreignKey: "groupId"
            },
            {
              onUpdate: "CASCADE",
              onDelete: "SET NULL"
            }
          );
          Group.belongsToMany(models.Topic, {
            through: "GroupTopic",
            as: "topic",
            foreignKey: "groupId"
          });
    }
  };

  Group.init({
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: "id"
      },
      organiserId: {
        allowNull: false,
        type: DataTypes.UUID,
        field: "organiser_id"
      },
      name: {
        type: DataTypes.STRING,
        field: "name",
        unique: true
      },
      description: {
        type: DataTypes.TEXT,
        field: "description"
      },
      slug: {
        type: DataTypes.STRING,
        field: "slug"
      },
      profilePicture: {
        type: DataTypes.STRING,
        field: "profile_picture",
        validate: {
          isUrl: true
        }
      },
      url: {
        type: DataTypes,
        field: "url",
        validate: {
          isUrl: true
        }
      },
      rating: {
        type: DataTypes.DECIMAL(4, 2),
        defaultValue: 5.0,
        field: "rating"
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: "is_active"
      },
      topicARN: {
        type: DataTypes.STRING(100),
        field: "topic_arn"
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
    modelName: 'Group',
  });

  Group.beforeCreate(async instance => {
    // instance.slug = instance.changed("name") && generateSlug(instance.name);
    // instance.url = `${process.env.DOMAIN}/${instance.slug}`;
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

  Group.beforeUpdate(instance => {
    // instance.slug = instance.changed("name") && generateSlug(instance.name);
    // instance.url = `${process.env.DOMAIN}/${instance.slug}`;
  });

  Group.afterDestroy(async instance => {
    instance.get("topicARN") &&
      (await axios.post(`${process.env.DOMAIN}/delete-sns-topic`, {
        topicArn: instance.get("topicARN")
      }));
  });

  return Group;
};
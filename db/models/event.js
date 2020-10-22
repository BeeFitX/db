'use strict';

const { Model } = require('sequelize');
const axios = require("axios");
const crypto = require("crypto");
const { generateSlug } = require('../../helpers/slug.helpers')

module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      Event.hasMany(models.EventImage, {
        as: 'images',
        foreignKey: 'eventId'
      }, { onDelete: "cascade" })
      Event.hasMany(models.EventLocation, {
        as: 'location',
        foreignKey: 'eventId'
      }, { onDelete: "cascade" })
    }
  };

  Event.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      field: "id"
    },
    groupId: {
      allowNull: false,
      type: DataTypes.UUID,
      field: "group_id"
    },
    venueId: {
      allowNull: true,
      type: DataTypes.UUID,
      field: "venue_id"
    },
    coverImageId: {
      allowNull: true,
      type: DataTypes.UUID,
      field: "cover_image_id"
    },
    name: {
      type: DataTypes.STRING,
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
    url: {
      type: DataTypes.STRING,
      field: "url",
      validate: {
        isUrl: true
      }
    },
    duration: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "duration"
    },
    headCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "head_count"
    },
    waitListCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "wait_list_count"
    },
    date: {
      type: DataTypes.DATE,
      field: "date",
      validate: {
        isDate: true
      }
    },
    time: {
      type: DataTypes.TIME,
      field: "time"
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
    status: {
      type: DataTypes.ENUM("created", "cancelled", "published", "pending", "approved", "denied", "past"),
      defaultValue: "created",
      field: "status"
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
    modelName: 'Event',
  });
  
  Event.beforeCreate(async instance => {
    const { Venue } = sequelize.models;
    instance.slug = instance.changed("name") && generateSlug(instance.name);
    instance.url = `${process.env.DOMAIN}/${instance.slug}`;
    if (instance.venueId) {
      instance.status = "pending"
      const { data: venue } = await Venue.findByPk(instance.venueId)
      if (instance.headCount > venue.capacity) throw new Error("This venue does not have enough room for your guests!")
    }
  });

  Event.afterCreate(async instance => {
    const { Venue } = sequelize.models;
    const { data: topic } = await axios.post(
      `${process.env.DOMAIN}/create-sns-topic`,
      {
        topic: crypto
          .createHash("sha256")
          .update(instance.slug)
          .digest("hex")
      }
    );
    instance.topicARN = topic;
    if (instance.venueId) {
      const { data: venue } =  await Venue.findByPk(instance.venueId)
      const { data: member } = await axios.get(`${process.env.DOMAIN}/member/${venue.managerId}`)
      member.email &&
        (await axios.post(`${process.env.DOMAIN}/send-email`, {
          ToAddresses: [member.email],
          MessageBodyHtmlData: `<h1>Congratulations</h1><br><h3>You have a new request on BeeFit.</h3>`,
          MessageBodyTextData: `Congratulations you have a new request on BeeFit`,
          MessageSubjectData: `Event Request on BeeFit`
        }));
    }
    return instance.update(
      {
        coverImageId:
          instance.images.find(image => image.isCover).id ||
          instance.images[0].id
      },
      { where: { id: instance.id } }
    );
  });

  Event.beforeUpdate(instance => {
    instance.slug = instance.changed("name") && generateSlug(instance.name) || instance.slug;
    instance.url = `${process.env.DOMAIN}/${instance.slug}`;
  });

  Event.afterUpdate(async instance => {
    const { Group } = sequelize.models;
    if (instance.changed("status") && instance.get("status") === "approved") {
      const { data: group } = await Group.findByPk(instance.groupId)
      const { data: member } = await axios.get(`${process.env.DOMAIN}/member/${group.organiserId}`)
      member.email && (await axios.post(`${process.env.DOMAIN}/send-email`, {
        ToAddresses: [member.email],
        MessageBodyHtmlData: `<h1>Congratulations</h1><br><h3>Your request has been approved by the Venue Manager BeeFit.</h3>`,
        MessageBodyTextData: `Congratulations your request has been approved by the Venue Manager BeeFit.`,
        MessageSubjectData: `Event Request Approved on BeeFit`
      }));
    }
    if (instance.changed("status") && instance.get("status") === "denied") {
      const { data: group } = await Group.findByPk(instance.groupId)
      const { data: member } = await axios.get(`${process.env.DOMAIN}/member/${group.organiserId}`)
      member.email && (await axios.post(`${process.env.DOMAIN}/send-email`, {
        ToAddresses: [member.email],
        MessageBodyHtmlData: `<h1>Soory</h1><br><h3>Your request has been denied by the Venue Manager BeeFit.</h3>`,
        MessageBodyTextData: `Sorry your request has been denied by the Venue Manager BeeFit.`,
        MessageSubjectData: `Event Request Denied on BeeFit`
      }));
    }
  });

  Event.afterDestroy(async instance => {
    instance.get("topicARN") &&
      (await axios.post(`${process.env.DOMAIN}/delete-sns-topic`, {
        topicArn: instance.get("topicARN")
      }));
  });
  
  return Event;
};
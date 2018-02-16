import { Meteor } from "meteor/meteor";
import { MediaRecords } from "/lib/collections";

/**
 * CollectionFS - Brand asset publication
  */
Meteor.publish("BrandAssets", () => MediaRecords.find({ "metadata.type": "brandAsset" }));

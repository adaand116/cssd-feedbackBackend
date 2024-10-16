import properties from "@sitevision/api/server/Properties";
import events from "@sitevision/api/common/events";
import resourceLocatorUtil from "@sitevision/api/server/ResourceLocatorUtil";
import mailUtil from "@sitevision/api/server/MailUtil";
import storage from "@sitevision/api/server/storage";
import logUtil from "@sitevision/api/server/LogUtil";
import { markAsOld } from "./utils";
import appData from "@sitevision/api/server/appData";

// Send an email when a post is added
events.on("feedback:postAdded", (options) => {
  const pageNode = resourceLocatorUtil.getNodeByIdentifier(options.node);
  const { displayName, URL } = properties.get(pageNode, "displayName", "URL");
  const emitter = resourceLocatorUtil.getNodeByIdentifier(options.emitter);
  const emitterName = properties.get(emitter, "displayName");
  const recipient = appData.get("feedbackRecipient");

  const subject = `Page "${displayName}" has a new feedback post`;
  const message = `Page "<a href="${URL}">${displayName}"</a> has a new feeback post by "${emitterName}"`;
  const mailBuilder = mailUtil.getMailBuilder();
  const mail = mailBuilder
    .setSubject(subject)
    .setHtmlMessage(message)
    .addRecipient(recipient)
    .build();

  mail.send();
});

// Mark isNewPost as false for up to 100 posts on the page when page is published
events.on("sv:publishing:publish", (options) => {
  const feedbackStorage = storage.getCollectionDataStore("feedback");
  const query = `+ds.analyzed.pageId:${options.node} +ds.analyzed.isNewPost:true`;

  feedbackStorage
    .find(query, {
      count: 100,
    })
    .each((error, data) => {
      if (error) {
        logUtil.error(JSON.stringify(error));
      }

      try {
        feedbackStorage.set(data.dsid, markAsOld(data));
        feedbackStorage.instantIndex(data.dsid);
      } catch (error) {
        logUtil.error(JSON.stringify(error));
      }
    });
});

import i18n from "@sitevision/api/common/i18n";
import router from "@sitevision/api/common/router";
import portletContextUtil from "@sitevision/api/server/PortletContextUtil";
import systemUserUtil from "@sitevision/api/server/SystemUserUtil";
import storage from "@sitevision/api/server/storage";
import logUtil from "@sitevision/api/server/LogUtil";
import { getFeedbackPosts, isAdmin } from "./utils";
import events from "@sitevision/api/common/events";

import "./events";
import timestampUtil from "@sitevision/api/server/TimestampUtil";

const feedbackStorage = storage.getCollectionDataStore("feedback");

// Middleware to handle authentication and permissions
router.use((req, res, next) => {
  if (systemUserUtil.isAnonymous()) {
    return res.status(401).json({ message: i18n.get("authRequired") });
  }

  if (req.method === "GET") {
    const currentUser = portletContextUtil.getCurrentUser();

    if (!isAdmin(currentUser)) {
      return res.status(403).json({ message: i18n.get("permissionDenied") });
    }
  }

  next();
});

router.get("/getPosts", (req, res) => {
  const params = req.params;
  if (!params.pageId) {
    return res.status(400).json({ message: i18n.get("missingParams") });
  }

  const posts = getFeedbackPosts(params.pageId);
  return res.json(posts);
});

router.post("/addPost", (req, res) => {
  const params = req.params;

  if (!params.pageId || !params.content) {
    return res.status(400).json({ message: i18n.get("missingParams") });
  }

  const currentUser = portletContextUtil.getCurrentUser();

  try {
    const post = feedbackStorage.add({
      pageId: params.pageId,
      content: params.content,
      author: currentUser.getIdentifier(),
      isNewPost: true,
      createdAt: timestampUtil.getTimestamp(),
    });
    feedbackStorage.instantIndex(post.dsid);
  } catch (error) {
    logUtil.error(JSON.stringify(error));
    return res.status(500);
  }

  // Custom event to send email when a post is added
  events.emit("feedback:postAdded", {
    node: params.pageId,
    emitter: currentUser.getIdentifier(),
  });

  return res.status(204);
});

import properties from "@sitevision/api/server/Properties";
import resourceLocatorUtil from "@sitevision/api/server/ResourceLocatorUtil";
import storage from "@sitevision/api/server/storage";
import timestampUtil from "@sitevision/api/server/TimestampUtil";
import trashcanUtil from "@sitevision/api/server/TrashcanUtil";

const isTrashed = (node) => !node || trashcanUtil.isInTrashcan(node);

export const getFeedbackPosts = (pageId) => {
  const pageNode = resourceLocatorUtil.getNodeByIdentifier(pageId);

  if (!pageNode) {
    return [];
  }

  const feedbackStorage = storage.getCollectionDataStore("feedback");
  const query = `+ds.analyzed.pageId:${pageId}`;

  const posts = feedbackStorage
    .find(query, {
      count: 100,
    })
    .toArray();

  if (!posts) {
    return [];
  }

  return posts
    .map((post) => {
      if (!isTrashed(pageNode)) {
        const authorNode = resourceLocatorUtil.getNodeByIdentifier(post.author);
        const author = properties.get(authorNode, "displayName");
        return {
          id: post.dsid,
          content: post.content,
          author,
          isNewPost: post.isNewPost,
          createdAt: timestampUtil.format(post.createdAt, "yyyy-MM-dd HH:mm"),
        };
      }
    })
    .filter(Boolean);
};

export const markAsOld = (post) => {
  if (post.isNewPost) {
    return {
      ...post,
      isNewPost: false,
    };
  }

  return post;
};

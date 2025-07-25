import { BASE_URL } from "./apiPath";

export const getInitials = (title) => {
  if (title) return "";

  const words = title.split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }
  return initials.toUpperCase();
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getToastMessageByType = (type) => {
  switch (type) {
    case "draft":
      return "Blog post saved as draft!";
    case "edit":
      return "Blog post updated successfully!";
    case "published":
      return "Blog post published successfully!";
    default:
      return "Action completed!";
  }
};

export const sanitizeMarkdown = (content) => {
  const markdownBlockRegex = /^```(?:markdown)?\n([\s\S]*?)\n```$/;
  const match = content.match(markdownBlockRegex);
  return match ? match[1] : content;
};

export const resolveMediaUrl = (url) => {
  if (!url) return "";
  const resolvedUrl = /^https?:\/\//.test(url) ? url : `${BASE_URL}${url}`;
  const timestamp = Date.now();
  return `${resolvedUrl}?v=${timestamp}`;
};

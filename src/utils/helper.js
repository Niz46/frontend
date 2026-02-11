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

const CLOUD_NAME = "duz7maquu"; // replace if necessary
const CLOUDINARY_BASE = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

export function resolveMediaUrl(input) {
  if (!input) return "";
  // if it's an array (you store arrays), take first item
  if (Array.isArray(input)) input = input[0];

  if (typeof input !== "string") return "";

  const trimmed = input.trim();

  // 1) If it's already an absolute URL, use as-is
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  // 2) If it already contains 'res.cloudinary.com' (but not full https), ensure http(s) prefix
  if (trimmed.includes("res.cloudinary.com")) {
    // add protocol if missing
    if (!/^https?:\/\//i.test(trimmed))
      return "https://" + trimmed.replace(/^\/+/, "");
    return trimmed;
  }

  // 3) If it contains '/image/upload' already (relative path), attach cloud base but avoid double slashes
  if (trimmed.includes("/image/upload")) {
    return `${CLOUDINARY_BASE}/${trimmed.replace(/^\/+/, "").replace(/^https?:\/\//, "")}`;
  }

  // 4) Otherwise assume it's a public_id or folder path and build URL
  return `${CLOUDINARY_BASE}/${trimmed}`;
}

export default function resolveImageUrl(value, { fallback = null } = {}) {
  if (!value) return fallback;
  if (typeof value !== "string") return fallback;
  if (/^https?:\/\//i.test(value)) return value;
  // Anything else is unexpected now (we moved to Cloudinary) — return fallback
  return fallback;
}

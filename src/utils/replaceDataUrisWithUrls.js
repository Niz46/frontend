// src/utils/replaceDataUrisWithUrls.js
import { uploadImagesPublic } from "./uploadImages";

export default async function replaceDataUrisWithUrls(
  markdown,
  { debug = false } = {},
) {
  if (!markdown || typeof markdown !== "string") return markdown;

  // Regex matches either Markdown image: ![alt](data:image/...base64,...) OR <img src="data:...">
  // We'll capture the full data URI.
  const dataUriRegex = /(data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+)/g;

  const matches = [...new Set(markdown.match(dataUriRegex) || [])]; // unique data URIs
  if (!matches.length) return markdown;

  if (debug)
    console.debug(
      "[replaceDataUrisWithUrls] found",
      matches.length,
      "embedded images",
    );

  const files = matches.map((dataUri, idx) => {
    const mimeMatch = dataUri.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/);
    const mime = (mimeMatch && mimeMatch[1]) || "image/png";
    const base64 = dataUri.split(",")[1] || "";
    // convert base64 -> uint8 array
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    // create a File — name is synthetic
    const ext = mime.split("/")[1].split("+")[0] || "png";
    const fileName = `embedded-${Date.now()}-${idx}.${ext}`;
    // File constructor is available in browsers
    try {
      return new File([byteArray], fileName, { type: mime });
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      // fallback for older environments: create a Blob with .name metadata
      const blob = new Blob([byteArray], { type: mime });
      blob.name = fileName;
      return blob;
    }
  });

  // Upload every file (uploadImagesPublic returns array of items)
  const uploadResults = await uploadImagesPublic(files);

  // uploadResults expected to be array of { url, timestamp } in same order
  let newMarkdown = markdown;
  for (let i = 0; i < matches.length; i++) {
    const dataUri = matches[i];
    const result = uploadResults[i];
    const url = result?.url;
    if (!url) {
      console.warn(
        "[replaceDataUrisWithUrls] missing url for uploaded image",
        result,
      );
      continue;
    }
    // replace all occurrences of this dataUri (should be unique)
    newMarkdown = newMarkdown.split(dataUri).join(url);
  }

  return newMarkdown;
}

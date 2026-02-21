// src/utils/docxToMarkdown.js
import mammoth from "mammoth";
import TurndownService from "turndown";

/**
 * Convert .docx ArrayBuffer -> Markdown.
 * This version converts embedded images to data URIs so images appear inline.
 *
 * @param {ArrayBuffer} arrayBuffer
 * @returns {Promise<string>} markdown
 */
export default async function docxToMarkdown(arrayBuffer) {
  const options = {
    convertImage: mammoth.images.inline(async function (element) {
      const imageBuffer = await element.read("base64");
      const contentType = element.contentType || "image/png";
      return {
        src: `data:${contentType};base64,${imageBuffer}`,
      };
    }),
    includeDefaultStyleMap: true,
  };

  const { value: html, messages } = await mammoth.convertToHtml(
    { arrayBuffer },
    options,
  );

  if (messages && messages.length) {
    // console.debug("mammoth messages:", messages);
  }

  const turndownService = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    linkStyle: "inlined",
  });

  const markdown = turndownService.turndown(html);
  return markdown;
}

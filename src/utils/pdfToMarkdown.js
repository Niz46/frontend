// src/utils/pdfToMarkdown.js
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

try {
  const workerPath = `${import.meta.env.BASE_URL}pdf.worker.min.mjs`;
  if (!pdfjsLib?.GlobalWorkerOptions?.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerPath;
  }
} catch (err) {
  console.warn("pdfToMarkdown: could not set workerSrc automatically.", err);
}

/**
 * Convert PDF ArrayBuffer -> plain text/markdown-like string.
 * @param {ArrayBuffer} arrayBuffer
 * @param {(progress:number)=>void} onProgress optional
 * @returns {Promise<string>}
 */
export default async function pdfToMarkdown(arrayBuffer, onProgress = null) {
  if (!arrayBuffer) throw new Error("No data provided to pdfToMarkdown");

  if (!pdfjsLib?.GlobalWorkerOptions?.workerSrc) {
    throw new Error(
      'PDF.js worker not configured. Please copy "pdf.worker.min.mjs" into your public folder (public/pdf.worker.min.mjs) and restart dev server.',
    );
  }

  try {
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    const numPages = pdf.numPages || 0;
    let fullText = "";

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((it) => it.str).join(" ");
      fullText += `\n\n<!-- page:${i} -->\n\n${pageText}\n`;

      if (onProgress) {
        onProgress(Math.round((i / numPages) * 100));
      }
    }

    const normalized = fullText
      .replace(/\r\n/g, "\n")
      .replace(/[ \t]+/g, " ")
      .trim();

    return normalized;
  } catch (err) {
    throw new Error(`PDF conversion failed: ${err?.message || err}`);
  }
}

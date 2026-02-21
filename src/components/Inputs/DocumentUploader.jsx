// src/components/Inputs/DocumentUploader.jsx
import { useState } from "react";
import docxToMarkdown from "../../utils/docxToMarkdown";
import pdfToMarkdown from "../../utils/pdfToMarkdown";
import { toast } from "react-hot-toast";

const DEFAULT_ACCEPT =
  ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf";

const DEFAULT_MAX = 10 * 1024 * 1024; // 10 MB

export default function DocumentUploader({
  onConverted,
  maxFileSize = DEFAULT_MAX,
  accept = DEFAULT_ACCEPT,
}) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFile = async (file) => {
    if (!file) return;
    setProgress(0);
    if (file.size > maxFileSize) {
      toast.error(
        `File too large. Max allowed ${(maxFileSize / 1024 / 1024).toFixed(1)} MB`,
      );
      return;
    }

    const ext = file.name.split(".").pop().toLowerCase();

    try {
      setLoading(true);
      const arrayBuffer = await readFileAsArrayBuffer(file);

      let markdown = "";
      if (ext === "docx") {
        markdown = await docxToMarkdown(arrayBuffer);
      } else if (ext === "pdf") {
        // pdfToMarkdown supports progress callback
        markdown = await pdfToMarkdown(arrayBuffer, (p) => setProgress(p));
      } else {
        toast.error("Unsupported file type");
        return;
      }

      setProgress(100);
      toast.success("Document converted — now editable");
      onConverted && onConverted(markdown);
    } catch (err) {
      console.error("Document conversion error", err);
      toast.error("Failed to convert document. See console.");
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 800);
    }
  };

  const onInputChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
    e.target.value = null;
  };

  return (
    <div className="document-uploader">
      <label className="block text-xs font-medium text-slate-600 mb-2">
        Import document (.docx / .pdf)
      </label>

      <div className="flex gap-2 items-center">
        <input
          type="file"
          accept={accept}
          onChange={onInputChange}
          disabled={loading}
          className="hidden"
          id="doc-upload-input"
        />
        <label
          htmlFor="doc-upload-input"
          className={`px-3 py-1 rounded cursor-pointer border text-sm ${loading ? "opacity-60 pointer-events-none" : ""}`}
        >
          Upload document
        </label>

        {loading && (
          <div className="text-xs">
            Converting... {progress ? `${progress}%` : ""}
          </div>
        )}
      </div>

      {progress > 0 && (
        <div className="mt-2 w-full bg-slate-100 h-2 rounded overflow-hidden">
          <div
            style={{ width: `${progress}%` }}
            className="h-full bg-sky-500 transition-all"
          />
        </div>
      )}

      <p className="text-xs text-slate-400 mt-2">
        Supported: .docx (best) & .pdf. Max{" "}
        {(maxFileSize / (1024 * 1024)).toFixed(0)}MB.
      </p>
    </div>
  );
}

// helper (FileReader -> ArrayBuffer)
function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => {
      reader.abort();
      reject(new Error("Failed to read file"));
    };
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsArrayBuffer(file);
  });
}

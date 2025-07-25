import { useState } from "react";
import { LuCopy, LuCheck } from "react-icons/lu";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  InstapaperShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  InstapaperIcon,
} from "react-share";

const SharePost = ({ title }) => {
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => console.err("Failed to Copy:", err));
  };
  return (
    <div className="my-6">
      <p className="text-gray-600 font-medium mb-3">Share Post</p>

      <div className="flex items-center gap-4">
        <FacebookShareButton url={shareUrl} title={title}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>

        <TwitterShareButton url={shareUrl} title={title}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>

        <WhatsappShareButton url={shareUrl} title={title}>
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>

        <InstapaperShareButton url={shareUrl} title={title}>
          <InstapaperIcon size={32} round />
        </InstapaperShareButton>

        <button className="bg-white hover:bg-sky-50 text-sky-800 font-medium px-2 py-2 rounded-full" onClick={handleCopyClick}>
          {isCopied ? <LuCheck className="text-[20px]" /> : <LuCopy className="text-[20px]" />}
        </button>
      </div>
    </div>
  );
};

export default SharePost;

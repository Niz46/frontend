// src/components/TopSlider/TopSlider.jsx
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts } from "../../../store/slices/blogSlice";

const SLIDE_INTERVAL_MS = 10_000; // Rotate every 10s
const DISPLAY_WINDOW_MS = 10 * 60_000; // Only show for 10min after post
const LAST_BANNER_TS_KEY = "LAST_BANNER_TS";

export default function TopSlider() {
  const dispatch = useDispatch();
  const posts = useSelector((s) => s.blog.posts);
  const status = useSelector((s) => s.blog.status);

  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  // 1) Fetch posts
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts({ status: "published", page: 1 }));
    }
  }, [status, dispatch]);

  // 2) Decide whether to show banner
  useEffect(() => {
    if (status !== "succeeded" || posts.length === 0) return;

    // get latest post timestamp (ISO string)
    const latestTs = posts[0].updatedAt || posts[0].createdAt;
    if (!latestTs) return;

    const latestMillis = new Date(latestTs).getTime();
    const storedMillis =
      parseInt(localStorage.getItem(LAST_BANNER_TS_KEY), 10) || 0;
    const now = Date.now();

    // if this is a brand‑new post AND it's within the display window
    if (
      latestMillis > storedMillis &&
      now - latestMillis <= DISPLAY_WINDOW_MS
    ) {
      // show banner
      setVisible(true);
      // record that we've shown it for this post
      localStorage.setItem(LAST_BANNER_TS_KEY, String(latestMillis));
    }
  }, [status, posts]);

  // 3) Cycle through titles while visible
  useEffect(() => {
    if (!visible || posts.length === 0) return;
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % posts.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(timerRef.current);
  }, [visible, posts]);

  // 4) Auto‑hide after display window expires
  useEffect(() => {
    if (!visible) return;
    const hideTimer = setTimeout(() => setVisible(false), DISPLAY_WINDOW_MS);
    return () => clearTimeout(hideTimer);
  }, [visible]);

  if (!visible || posts.length === 0) return null;

  const post = posts[current];

  return (
    <div
      className="
        w-full bg-sky-600 text-white
        px-4 py-2 flex items-center justify-center
        animate-slideIn-out
      "
      style={{ animationDuration: `${SLIDE_INTERVAL_MS}ms, 500ms` }}
    >
      <span className="font-semibold mr-2">🆕 New Journal:</span>
      <span className="truncate max-w-xl">{post.title}</span>
    </div>
  );
}

import { useState } from "react";

const TagInput = ({ tags, setTags }) => {
  const [input, setInput] = useState("");

  // Utility to commit any pending tag text
  const commitTag = (raw) => {
    const newTag = raw.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
  };

  const handleKeyDown = (e) => {
    // ENTER or COMMA
    if (e.key === "Enter") {
      e.preventDefault();
      commitTag(input);
      setInput("");
    }
    // BACKSPACE on empty input: remove last tag
    else if (e.key === "Backspace" && !input && tags.length) {
      e.preventDefault();
      setTags(tags.slice(0, -1));
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    // If user typed or pasted a comma, split out tags immediately
    if (val.includes(",")) {
      val
        .split(",")
        .filter((part) => part.trim() !== "")
        .forEach(commitTag);
      setInput(""); // reset after splitting
    } else {
      setInput(val);
    }
  };

  const handleRemove = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-wrap gap-2 items-center border border-gray-300 rounded-md p-2 min-h-[48px] mt-3">
      {tags.map((tag, i) => (
        <div
          className="flex items-center bg-sky-100/70 text-sky-700 px-3 py-1 rounded text-sm font-medium"
          key={i}
        >
          {tag}{" "}
          <button
            type="button"
            className="ml-2 text-sky-500 hover:text-sky-700 font-bold cursor-pointer"
            onClick={() => handleRemove(i)}
          >
            &times;
          </button>
        </div>
      ))}
      <input
        type="text"
        value={input}
        className="flex-1 min-w-[120px] border-none outline-none text-sm p-1"
        placeholder="Type and press enter or comma"
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        autoComplete="off"
      />
    </div>
  );
};

export default TagInput;
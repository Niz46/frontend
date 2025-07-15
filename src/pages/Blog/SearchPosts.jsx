import BlogLayout from "../../components/layouts/BlogLayout/BlogLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { useNavigate, useSearchParams } from "react-router-dom";
import BlogPostSummaryCard from "./components/BlogPostSummaryCard";
import moment from "moment";
import { useEffect, useState } from "react";

const SearchPosts = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.POSTS.SEARCH, {
        params: { q: query },
      });
      if (response.data) {
        setSearchResults(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleClick = (post) => {
    navigate(`/${post.slug}`);
  };

  useEffect(() => {
    handleSearch();

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);
  return (
    <BlogLayout>
      <div>
        <h3 className="">
          Showing search results matching:"{" "}
          <span className="text-sky-500">{query}</span>"
        </h3>

        <div className="">
          {searchResults.length > 0 &&
            searchResults.map((item) => (
              <BlogPostSummaryCard
                key={item._id}
                title={item.title}
                coverImageUrl={item.coverImageUrl}
                description={item.content}
                tags={item.tags}
                updatedOn={
                  item.updatedAt
                    ? moment(item.updatedAt).format("Do MMM YYYY")
                    : "-"
                }
                authorName={item.author.name}
                authorProfileImg={item.author.profileImageUrl}
                onClick={() => handleClick(item)}
              />
            ))}
        </div>
      </div>
    </BlogLayout>
  );
};

export default SearchPosts;

import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Search({ onSearchResults }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogsRes, usersRes] = await Promise.all([
          axios.get("http://localhost:3000/blogs"),
          axios.get("http://localhost:3000/users"),
        ]);

        const usersMap = Object.fromEntries(
          usersRes.data.map((user) => [user.id, user])
        );

        const enhancedBlogs = blogsRes.data.map((blog) => ({
          ...blog,
          username:
            blog.username || usersMap[blog.userId]?.username || "Anonymous",
        }));

        setBlogs(enhancedBlogs);
        if (onSearchResults) onSearchResults(enhancedBlogs);
      } catch (err) {
        console.log("error in fetchData function in Search component", err);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.trim().toLowerCase();
    setSearchTerm(event.target.value);

    if (!term) {
      if (onSearchResults) onSearchResults(blogs);
      return;
    }

    const filteredBlogs = blogs.filter((blog) => {
      const searchFields = [
        blog.title || "",
        blog.caption || "",
        blog.username || "",
      ].map((field) => field.toString().toLowerCase());

      return searchFields.some((field) => field.includes(term));
    });

    if (onSearchResults) onSearchResults(filteredBlogs);
  };

  return (
    <div className="flex">
      <div>
        <label className="input input-primary">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input
            type="search"
            className="grow"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearch}
          />
        </label>
      </div>
    </div>
  );
}

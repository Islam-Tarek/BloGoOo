import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";

export default function Profile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedBlogId, setExpandedBlogId] = useState(null);

  useEffect(() => {
    const fetchUserAndBlogs = async () => {
      setLoading(true);
      try {
        const userRes = await axios.get(
          `${import.meta.env.VITE_HOST}/users/${userId}`
        );
        setUser(userRes.data);

        const blogsRes = await axios.get(
          `${import.meta.env.VITE_HOST}/blogs?userId=${userId}`
        );
        setBlogs(blogsRes.data);
      } catch (err) {
        setUser(null);
        setBlogs([]);
      }
      setLoading(false);
    };
    fetchUserAndBlogs();
  }, [userId]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!user)
    return (
      <div className="text-center mt-10 text-red-500">User not found.</div>
    );

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-base-100 rounded shadow">
      <div className="flex items-center gap-6 mb-8">
        <img
          src={user.profilePicture || "https://via.placeholder.com/100"}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-2 border-primary"
        />
        <div>
          <h2 className="text-2xl font-bold">{user.username}</h2>
          <div className="text-gray-500">{user.email}</div>
          {user.bio && <div className="mt-2">{user.bio}</div>}
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-4">Blogs by {user.username}</h3>
      {blogs.length === 0 ? (
        <div className="text-gray-400">No blogs yet.</div>
      ) : (
        <div className="flex flex-col gap-8">
          {blogs.map((blog) => {
            const isExpanded = expandedBlogId === blog.id;
            const shouldTruncate = blog.caption.length > 300;

            return (
              <div
                key={blog.id}
                className="w-full bg-base-200 p-6 rounded shadow"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {blog.pictureUrl && (
                    <img
                      src={blog.pictureUrl}
                      alt="Blog"
                      className="w-full md:w-60 h-48 object-cover rounded"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/100";
                      }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-2xl mb-2">{blog.title}</div>
                    <div className="text-xs text-gray-500 mb-2">
                      {blog.createdAt
                        ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "Unknown date"}
                    </div>
                    <div
                      className="text-gray-700"
                      style={{
                        wordBreak: "break-word",
                        whiteSpace: "pre-line",
                        ...(!isExpanded &&
                          shouldTruncate && {
                            display: "-webkit-box",
                            WebkitLineClamp: "3",
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }),
                      }}
                    >
                      {shouldTruncate && !isExpanded
                        ? `${blog.caption.slice(0, 300)}...`
                        : blog.caption}
                    </div>
                    {shouldTruncate && (
                      <button
                        onClick={() =>
                          setExpandedBlogId(isExpanded ? null : blog.id)
                        }
                        className="text-blue-500 hover:text-blue-600 mt-2"
                      >
                        {isExpanded ? "Show less" : "Read more"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

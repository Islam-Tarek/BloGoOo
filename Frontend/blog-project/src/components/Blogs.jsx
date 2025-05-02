import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

export default function Blogs({ blogs: propBlogs, refreshBlogs }) {
  const [blogs, setBlogs] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [hiddenBlogs, setHiddenBlogs] = useState([]);
  const [expandedBlogId, setExpandedBlogId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndBlogs = async () => {
      try {
        const token = Cookies.get("accessToken");
        if (!token) return;

        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.sub || payload.id;

        const userResponse = await axios.get(
          `http://localhost:3000/users/${userId}`
        );
        setCurrentUser(userResponse.data);
        setHiddenBlogs(userResponse.data.hiddenBlogs || []);

        if (!propBlogs) {
          const blogsResponse = await axios.get("http://localhost:3000/blogs");
          setBlogs(blogsResponse.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchUserAndBlogs();
  }, [propBlogs, refreshBlogs]);

  const handleEdit = (blogId) => {
    navigate(`/edit-blog/${blogId}`);
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await axios.delete(`http://localhost:3000/blogs/${blogId}`);
      setBlogs(blogs.filter((blog) => blog.id !== blogId));
      toast.success("Blog deleted successfully", {
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Error deleting blog", {
        position: "bottom-right",
      });
    }
  };

  const handleHideBlog = async (blogId) => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) return;

      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.sub || payload.id;

      const updatedHiddenBlogs = [...hiddenBlogs, blogId];
      await axios.patch(`http://localhost:3000/users/${userId}`, {
        hiddenBlogs: updatedHiddenBlogs,
      });
      toast.success("Blog hidden successfully", {
        position: "bottom-right",
      });

      setHiddenBlogs(updatedHiddenBlogs);
    } catch (error) {
      console.error("Error hiding blog:", error);
      toast.error("Error hiding blog", {
        position: "bottom-right",
      });
    }
  };

  const visibleBlogs = (propBlogs || blogs).filter(
    (blog) => !hiddenBlogs.includes(blog.id)
  );

  return (
    <div className="blogs ms-28 py-3">
      {visibleBlogs.map((blog) => {
        const isExpanded = expandedBlogId === blog.id;
        const shouldTruncate = blog.caption && blog.caption.length > 300;
        return (
          <div
            key={blog.id}
            className="blog bg-base-100 py-3 mb-10 w-2xl shadow-lg"
          >
            <div className="blog-topbar flex flex-col md:flex-row md:justify-between mx-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={
                      blog.userProfilePicture ||
                      "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    }
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span
                    className="font-semibold cursor-pointer hover:underline truncate max-w-xs"
                    onClick={() => navigate(`/profile/${blog.userId}`)}
                    title={blog.username}
                  >
                    {blog.username || "Anonymous"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {blog.createdAt
                      ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Unknown date"}
                  </span>
                </div>
              </div>
              <div className="blog-settings dropdown dropdown-bottom m-1 md:self-start md:ml-auto">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn m-1 -tracking-tighter"
                >
                  ...
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-box z-1 w-40 p-2 shadow-sm"
                >
                  {currentUser && blog.userId === currentUser.id ? (
                    <>
                      <li>
                        <a onClick={() => handleEdit(blog.id)}>Edit</a>
                      </li>
                      <li>
                        <a onClick={() => handleDelete(blog.id)}>Delete</a>
                      </li>
                    </>
                  ) : (
                    <li>
                      <a onClick={() => handleHideBlog(blog.id)}>
                        I Don't want to see this
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            {/* Blog Title below author info */}
            <div className="px-4 pt-2 pb-1">
              <h2
                className="blog-title font-bold text-lg break-words whitespace-pre-line truncate-2-lines"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  wordBreak: "break-word",
                }}
                title={blog.title}
              >
                {blog.title}
              </h2>
            </div>
            <div className="blog-caption-box text-start m-2">
              <p
                className="blog-caption m-1 break-words whitespace-pre-line"
                style={
                  !isExpanded
                    ? {
                        display: "-webkit-box",
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        wordBreak: "break-word",
                      }
                    : { wordBreak: "break-word", whiteSpace: "pre-line" }
                }
                title={blog.caption}
              >
                {isExpanded || !shouldTruncate
                  ? blog.caption
                  : blog.caption.slice(0, 300) + "..."}
              </p>
              {shouldTruncate && (
                <button
                  className="text-blue-600 underline text-sm mt-1 cursor-pointer"
                  onClick={() => setExpandedBlogId(isExpanded ? null : blog.id)}
                >
                  {isExpanded ? "Show less" : "Read more"}
                </button>
              )}
            </div>
            {blog.pictureUrl && (
              <figure className="px-3 py-3 my-2 flex justify-center">
                <img
                  src={blog.pictureUrl}
                  alt="Blog"
                  className="rounded-xl m-1"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                />
              </figure>
            )}
          </div>
        );
      })}
    </div>
  );
}

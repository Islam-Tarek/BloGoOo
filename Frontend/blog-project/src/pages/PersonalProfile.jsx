import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PersonalProfile() {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndBlogs = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("accessToken");
        if (!token) {
          navigate("/login");
          return;
        }
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.sub || payload.id;

        const userRes = await axios.get(
          `http://localhost:3000/users/${userId}`
        );
        setUser(userRes.data);

        const blogsRes = await axios.get(
          `http://localhost:3000/blogs?userId=${userId}`
        );
        setBlogs(blogsRes.data);
      } catch (err) {
        setUser(null);
        setBlogs([]);
      }
      setLoading(false);
    };
    fetchUserAndBlogs();
  }, [navigate]);

  const handleEdit = (blogId) => {
    navigate(`/edit-blog/${blogId}`);
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await axios.delete(`http://localhost:3000/blogs/${blogId}`);
      setBlogs((prev) => prev.filter((blog) => blog.id !== blogId));
      toast.success("Blog deleted successfully", {
        position: "bottom-right",
      });
    } catch (error) {
      toast.error("Failed to delete blog", {
        position: "bottom-right",
      });
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!user)
    return (
      <div className="text-center mt-10 text-red-500">User not found.</div>
    );

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-base-100 rounded shadow">
      <div className="flex items-center gap-6 mb-8">
        <img
          src={
            user.profilePicture ||
            "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
          }
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border-2 border-primary"
        />
        <div>
          <h2 className="text-2xl font-bold">{user.username}</h2>
          <div className="text-gray-500">{user.email}</div>
          {user.bio && <div className="mt-2">{user.bio}</div>}
          <div className="flex gap-3 mt-4">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/editprofile")}
            >
              Edit Profile
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/password")}
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-4">Your Blogs</h3>
      {blogs.length === 0 ? (
        <div className="text-gray-400">You haven't written any blogs yet.</div>
      ) : (
        <div className="flex flex-col gap-6">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="w-full bg-base-200 p-4 rounded shadow flex flex-col md:flex-row gap-4"
              style={{ overflow: "hidden" }}
            >
              {blog.pictureUrl && (
                <img
                  src={blog.pictureUrl}
                  alt="Blog"
                  className="w-full md:w-44 h-32 object-cover rounded flex-shrink-0"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/100";
                  }}
                />
              )}
              <div className="flex-1 flex flex-col min-w-0">
                <div className="font-bold text-xl mb-1 truncate">
                  {blog.title}
                </div>
                <div className="text-xs text-gray-500 mb-1">
                  {blog.createdAt
                    ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Unknown date"}
                </div>
                <div
                  className="text-gray-700 overflow-auto max-h-32 break-words"
                  style={{ wordBreak: "break-word", whiteSpace: "pre-line" }}
                >
                  {blog.caption}
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => handleEdit(blog.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleDelete(blog.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer position="bottom-right" />
    </div>
  );
}

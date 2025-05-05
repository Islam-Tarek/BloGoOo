import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";

export default function Profile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndBlogs = async () => {
      setLoading(true);
      try {
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
          src={
            user.profilePicture ||
            "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
          }
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
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="w-full bg-base-200 p-6 rounded shadow flex flex-col md:flex-row gap-6"
            >
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
              <div className="flex-1 flex flex-col">
                <div className="font-bold text-2xl mb-2">{blog.title}</div>
                <div className="text-xs text-gray-500 mb-2">
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
                <div className="text-gray-700">{blog.caption}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

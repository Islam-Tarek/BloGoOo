import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import Cookies from "js-cookie";

export default function EditBlog() {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:3000/blogs/${blogId}`);
        setBlog(res.data);
        setTitle(res.data.title || "");
        setCaption(res.data.caption || "");
        setPictureUrl(res.data.pictureUrl || "");
      } catch (err) {
        setError("Failed to fetch blog.");
      }
      setLoading(false);
    };
    fetchBlog();
  }, [blogId]);

  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await axios.post(
        "https://api.imgbb.com/1/upload",
        formData,
        {
          params: {
            key: "2e0f19f1ad576ff1d5d842cd56c08a90",
          },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.data.url;
    } catch (error) {
      setError("Error uploading image.");
      throw error;
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      let newPictureUrl = pictureUrl;
      if (selectedFile) {
        newPictureUrl = await uploadToImgBB(selectedFile);
      }
      await axios.patch(`http://localhost:3000/blogs/${blogId}`, {
        title,
        caption,
        pictureUrl: newPictureUrl,
      });
      alert("Blog updated successfully!");
      navigate("/personal-profile");
    } catch (err) {
      setError("Failed to update blog.");
    }
    setSaving(false);
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!blog)
    return (
      <div className="text-center mt-10 text-red-500">Blog not found.</div>
    );

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-base-100 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Edit Blog</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input
            type="text"
            className="input input-primary w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            minLength={3}
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Caption</label>
          <textarea
            className="textarea textarea-primary w-full"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            minLength={10}
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input file-input-primary w-full"
          />
          <div className="mt-2">
            <img
              src={
                selectedFile ? URL.createObjectURL(selectedFile) : pictureUrl
              }
              alt="Blog"
              className="max-h-40 rounded"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/150";
              }}
            />
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

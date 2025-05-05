import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        const res = await axios.get(
          `${import.meta.env.VITE_HOST}/blogs/${blogId}`
        );
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
            key: import.meta.env.VITE_IMGBB_API_KEY,
          },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (
        !response.data ||
        !response.data.data ||
        !response.data.data.display_url
      ) {
        throw new Error("Invalid response from ImgBB");
      }
      return response.data.data.display_url;
    } catch (error) {
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
        if (!newPictureUrl) {
          setSaving(false);
          toast.error("Failed to upload image. Please try again.", {
            position: "bottom-right",
          });
          return;
        }
      }
      await axios.patch(`${import.meta.env.VITE_HOST}/blogs/${blogId}`, {
        title,
        caption,
        pictureUrl: newPictureUrl,
      });
      setSaving(false);
      setSelectedFile(null);
      toast.success("Blog updated successfully", {
        position: "bottom-right",
      });
      setTimeout(() => {
        navigate("/personal-profile");
      }, 1000);
    } catch (err) {
      setSaving(false);
      setError("Failed to update blog.");
      toast.error("Error updating blog", {
        position: "bottom-right",
      });
    }
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
      <ToastContainer position="bottom-right" />
    </div>
  );
}

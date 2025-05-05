import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  pictureUrl: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || val === "" || /^https?:\/\/.+\..+/.test(val), {
      message: "Please enter a valid image URL",
    }),
  caption: z.string().min(10, "Caption must be at least 10 characters"),
});

export default function BlogForm({ setRefreshBlogs }) {
  const navigate = useNavigate();
  const [useImageUpload, setUseImageUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
  });

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
      console.error("Error uploading to ImgBB:", error);
      throw error;
    }
  };

  const uploadUrlToImgBB = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], "image.jpg", { type: blob.type });
      return await uploadToImgBB(file);
    } catch (error) {
      console.error("Error uploading image URL to ImgBB:", error);
      throw error;
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setValue("pictureUrl", "");
    }
  };

  const onSubmit = async (data) => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        toast.error("You must be logged in to create a blog", {
          position: "bottom-right",
        });

        navigate("/login");
        return;
      }

      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.sub || payload.id;

      const userResponse = await axios.get(
        `http://localhost:3000/users/${userId}`
      );
      const { username, profilePicture } = userResponse.data;

      let pictureUrl = "";
      if (selectedFile) {
        pictureUrl = await uploadToImgBB(selectedFile);
      } else if (data.pictureUrl && data.pictureUrl.trim() !== "") {
        try {
          pictureUrl = await uploadUrlToImgBB(data.pictureUrl.trim());
        } catch (err) {
          pictureUrl = data.pictureUrl.trim();
        }
      }

      // Build blog object, omit pictureUrl if not present
      const blogData = {
        title: data.title,
        caption: data.caption,
        userId,
        username,
        userProfilePicture: profilePicture,
        createdAt: new Date().toISOString(),
      };
      if (pictureUrl) {
        blogData.pictureUrl = pictureUrl;
      }

      await axios.post("http://localhost:3000/blogs", blogData);

      reset({
        title: "",
        pictureUrl: "",
        caption: "",
      });
      setSelectedFile(null);

      if (setRefreshBlogs) setRefreshBlogs(true);

      toast.success("Blog published successfully", {
        position: "bottom-right",
      });
      navigate("/");
    } catch (error) {
      console.error("Failed to create blog:", error);
      toast.error("Failed to create blog", {
        position: "bottom-right",
      });
    }
  };

  return (
    <form
      className="blog-from flex flex-col w-2xl ms-36 py-3"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="form-title m-4 px-2 font-extrabold underline text-2xl">
        Create blog
      </h2>
      <div className="blog-image m-4">
        <div className="flex items-center gap-4 mb-2">
          <button
            type="button"
            className={`btn ${!useImageUpload ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setUseImageUpload(false)}
          >
            Use Image URL
          </button>
          <button
            type="button"
            className={`btn ${useImageUpload ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setUseImageUpload(true)}
          >
            Upload Image
          </button>
        </div>
        {useImageUpload ? (
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input file-input-primary w-full"
            />
            {selectedFile && (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="mt-2 max-h-40 object-contain"
              />
            )}
          </div>
        ) : (
          <div>
            <input
              type="text"
              className={`input input-primary w-full ${
                errors.pictureUrl ? "input-error" : ""
              }`}
              placeholder="Enter image URL"
              {...register("pictureUrl")}
            />
            {errors.pictureUrl && (
              <p className="text-red-500 text-xs mt-1">
                {errors.pictureUrl.message}
              </p>
            )}
          </div>
        )}
      </div>
      <div className="blog-title m-4">
        <span className="m-3 p-1 font-bold">Title</span>
        <input
          type="text"
          className={`input  input-primary m-3 p-1 w-full ${
            errors.title ? "input-error" : ""
          }`}
          {...register("title")}
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
        )}
      </div>
      <div className="blog-caption m-6">
        <span className="font-bold">Blog Content</span>

        <textarea
          placeholder="Write here..."
          className={`textarea textarea-lg textarea-primary h-35 w-full ${
            errors.caption ? "textarea-error" : ""
          }`}
          {...register("caption")}
        ></textarea>
        {errors.caption && (
          <p className="text-red-500 text-xs mt-1">{errors.caption.message}</p>
        )}
      </div>
      <div className="submit-btn m-4 p-4">
        <button
          disabled={isSubmitting}
          className="btn btn-success p-2 font-extrabold"
        >
          {isSubmitting ? "Publishing..." : "Publish"}
        </button>
      </div>
    </form>
  );
}

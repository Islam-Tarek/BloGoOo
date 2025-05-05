import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});

export default function EditProfile() {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("accessToken");
        if (!token) return;

        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.sub || payload.id;

        const response = await axios.get(
          `${import.meta.env.VITE_HOST}/users/${userId}`
        );
        setUserData(response.data);

        setValue("username", response.data.username);
        setValue("email", response.data.email);
        setValue("bio", response.data.bio || "");
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [setValue]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

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
    return response.data.data.display_url;
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const url = await uploadToImgBB(file);

      const token = Cookies.get("accessToken");
      if (!token) throw new Error("Not logged in");
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.sub || payload.id;

      // Update user with ImgBB URL
      const userResponse = await axios.patch(
        `${import.meta.env.VITE_HOST}/users/${userId}`,
        { profilePicture: url }
      );
      if (userResponse.status !== 200)
        throw new Error("Failed to update user profile");

      setUserData((prev) => ({
        ...prev,
        profilePicture: url,
      }));

      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast.error(
        error.message ||
          error.response?.data?.error ||
          "Failed to update profile picture"
      );
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) return;

      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.sub || payload.id;

      await axios.patch(`${import.meta.env.VITE_HOST}/users/${userId}`, data);
      toast.success("Profile updated successfully", {
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile", {
        position: "bottom-right",
      });
    }
  };

  return (
    <div className="edit-profile w-3xl ms-16 py-3">
      <h2 className="form-title m-4 px-2 font-extrabold underline text-2xl">
        Edit Profile
      </h2>
      <div className="profile-container p-4 flex justify-between">
        <form className="avatar flex flex-col p-2 m-2 ms-5 w-40">
          <div
            className="ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2 cursor-pointer"
            onClick={handleImageClick}
          >
            <img
              src={
                userData?.profilePicture || "https://via.placeholder.com/100"
              }
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
          <div className="new-avatar -ms-3.5 mt-2 pt-1 ps-1 w-35 h-12 flex flex-col gap-2">
            <button
              type="button"
              className="btn btn-primary rounded-4xl w-33"
              onClick={handleImageClick}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload image"}
            </button>
          </div>
        </form>

        <form
          className="profile-data m-4 ms-8 ps-8 w-3xl flex flex-col"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="profile-username p-4 ms-10">
            <label className="input validator input-primary">
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
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </g>
              </svg>
              <input
                type="input"
                required
                placeholder="Username"
                pattern="[A-Za-z][A-Za-z0-9\-]*"
                minLength="3"
                maxLength="30"
                title="Only letters, numbers or dash"
                {...register("username")}
              />
            </label>
            <p className="validator-hint">
              Must be 3 to 30 characters
              <br />
              containing only letters, numbers or dash
            </p>
          </div>
          <div className="profile-email mb-8 ms-10 p-4">
            <label className="input validator input-primary">
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
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </g>
              </svg>
              <input
                type="email"
                placeholder="mail@site.com"
                required
                {...register("email")}
              />
            </label>
            <div className="validator-hint hidden">
              Enter valid email address
            </div>
          </div>
          <div className="profile-bio py-4 flex gap-8">
            <label htmlFor="bio" className="font-semibold flex pt-12">
              Bio
            </label>
            <textarea
              {...register("bio")}
              placeholder="Write here..."
              className="textarea textarea-lg textarea-primary h-35 w-96"
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary w-40 mt-4">
            Save Changes
          </button>
        </form>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import bcrypt from "bcryptjs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [rewriteNewPassword, setRewriteNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !rewriteNewPassword) {
      setError("All fields are required.");
      setSuccess("");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      setSuccess("");
      return;
    }
    if (newPassword !== rewriteNewPassword) {
      setError("New passwords do not match.");
      setSuccess("");
      return;
    }

    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        setError("You must be logged in.");
        setSuccess("");
        return;
      }
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.sub || payload.id;

      const userRes = await axios.get(
        `${import.meta.env.VITE_HOST}/users/${userId}`
      );
      const dbPassword = userRes.data.password;

      const isMatch = await bcrypt.compare(currentPassword, dbPassword);
      if (!isMatch) {
        setError("Current password is incorrect.");
        setSuccess("");
        return;
      }

      await axios.patch(`${import.meta.env.VITE_HOST}/users/${userId}`, {
        password: newPassword,
      });
      setError("");
      setSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setRewriteNewPassword("");
      toast.success("Password changed successfully", {
        position: "bottom-right",
      });
    } catch (err) {
      setSuccess("");
      setError("Failed to change password. Try again.");
      console.error("Error changing password:", err);
      toast.error("Error changing password", {
        position: "bottom-right",
      });
    }
  };

  return (
    <form
      className="password-form flex flex-col w-2xl ms-36 py-3"
      onSubmit={handlePassword}
    >
      <h2 className="form-title m-4 px-2 font-extrabold underline text-2xl">
        Change Password
      </h2>
      {error && <div className="text-red-500 ms-4 mb-2">{error}</div>}
      {success && <div className="text-green-600 ms-4 mb-2">{success}</div>}
      <div className="current-password m-4 p-4">
        <span className="m-3 p-1 font-serif">Current Password</span>
        <input
          id="current-password"
          type="password"
          placeholder="write here.."
          className="input input-primary ms-10 font-bold"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>
      <div className="new-password m-4 p-4">
        <span className="m-3 p-1 font-serif">New Password</span>
        <input
          id="new-password"
          type="password"
          placeholder="write here.."
          className="input input-primary ms-14 font-bold"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div className="rewrite-new-password m-4 p-4">
        <span className="m-3 p-1 font-serif">Rewrite New Password</span>
        <input
          id="rewrite-new-password"
          type="password"
          placeholder="write here.."
          className="input input-primary m-1 font-bold"
          value={rewriteNewPassword}
          onChange={(e) => setRewriteNewPassword(e.target.value)}
        />
      </div>
      <div className="submit-button">
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </div>
      <ToastContainer position="bottom-right" />
    </form>
  );
}

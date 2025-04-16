import React from "react";
import { Routes, Route } from "react-router";
import Blogs from "../components/Blogs";
import BlogForm from "../components/BlogForm";
import ChangePassword from "../components/ChangePassword";
import EditProfile from "../components/EditProfile";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="flex py-4 mt-15">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Blogs />} />
          <Route path="/newblog" element={<BlogForm />} />
          <Route path="/password" element={<ChangePassword />} />
          <Route path="/editprofile" element={<EditProfile />} />
        </Routes>
      </div>
    </div>
  );
}

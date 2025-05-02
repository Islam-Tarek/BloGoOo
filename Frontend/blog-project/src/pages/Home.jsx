import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router";
import Blogs from "../components/Blogs";
import BlogForm from "../components/BlogForm";
import ChangePassword from "../components/ChangePassword";
import EditProfile from "../components/EditProfile";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Register from "./Register";
import Login from "./Login";
import Profile from "./Profile";
import PersonalProfile from "./PersonalProfile";
import EditBlog from "./EditBlog";
import Error from "./Error";
import Cookies from "js-cookie";
import AddBlogButton from "../components/AddBlogButton";

export default function Home() {
  const location = useLocation();
  const hideNavbarAndSidebar = ["/login", "/register"].includes(
    location.pathname
  );
  const isLoggedIn = !!Cookies.get("accessToken");
  const [displayBlogs, setDisplayBlogs] = useState(null);
  const [refreshBlogs, setRefreshBlogs] = useState(false);

  const handleSearchResults = (blogs) => {
    setDisplayBlogs(blogs);
  };

  const isProtectedRoute = (pathname) => {
    return !["/", "/login", "/register"].includes(pathname);
  };

  if (!isLoggedIn && isProtectedRoute(location.pathname)) {
    return <Error />;
  }

  if (refreshBlogs) {
    setRefreshBlogs(false);
    setDisplayBlogs(null);
  }

  return (
    <div>
      {!hideNavbarAndSidebar && (
        <Navbar onSearchResults={handleSearchResults} />
      )}
      <div
        className={`flex py-4 mt-15 ${
          isLoggedIn
            ? "with-sidebar"
            : hideNavbarAndSidebar
            ? ""
            : "justify-center items-center"
        }`}
      >
        {isLoggedIn && <Sidebar />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <>
                <Blogs
                  blogs={displayBlogs}
                  onSearchResults={handleSearchResults}
                  refreshBlogs={refreshBlogs}
                />
                {isLoggedIn && <AddBlogButton />}
              </>
            }
          />
          <Route
            path="/newblog"
            element={<BlogForm setRefreshBlogs={setRefreshBlogs} />}
          />
          <Route path="/password" element={<ChangePassword />} />
          <Route path="/editprofile" element={<EditProfile />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/personal-profile" element={<PersonalProfile />} />
          <Route path="/edit-blog/:blogId" element={<EditBlog />} />
        </Routes>
      </div>
    </div>
  );
}

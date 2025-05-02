import React from "react";
import { Link } from "react-router";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export default function Sidebar() {
  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("user");
    toast.success("Logged out successfully", {
      position: "bottom-right",
    });
  };

  return (
    <div className="sidebar flex flex-col ms-2 w-65 text-left">
      <div className="pe-4 mt-2 border-r-2 border-gray-700 ">
        <div className="dashboard h-52 ps-5 flex flex-col gap-3">
          <h3 className="underline mb-5 ps-8 pb-3 font-bold">Dashboard</h3>
          <div className="ps-14 p-2 w-40 hover:border-l-2 cursor-pointer">
            <Link to="/" className="block w-full h-full">
              Blogs
            </Link>
          </div>
          <div className="ps-14 p-2 w-40 hover:border-l-2 cursor-pointer">
            <Link to="/newblog" className="block w-full h-full">
              Write
            </Link>
          </div>
        </div>
        <div className="settings h-52 ps-5 flex flex-col gap-3">
          <h3 className="underline mb-5 mt-3 ps-8 pb-3 font-bold">Settings</h3>
          <div className="ps-14 p-2 w-40 hover:border-l-2 cursor-pointer">
            <Link to="/personal-profile" className="block w-full h-full">
              Profile
            </Link>
          </div>

          <div className="ps-14 p-2 w-40 hover:border-l-2 cursor-pointer">
            <Link to="/editprofile" className="block w-full h-full">
              Edit profile
            </Link>
          </div>
          <div className="ps-14 p-2 w-48 hover:border-l-2 cursor-pointer">
            <Link to="/password" className="block w-full h-full">
              Change Password
            </Link>
          </div>
          <div className="ps-14 p-2 w-48 hover:border-l-2 cursor-pointer">
            <Link to="/login" onClick={handleLogout}>
              Logout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { Link } from "react-router";
import Search from "./Search";
import Cookies from "js-cookie";

export default function Navbar({ onSearchResults }) {
  const isLoggedIn = !!Cookies.get("accessToken");

  return (
    <div>
      <div className="navbar fixed top-0 z-3 bg-base-100 shadow-sm">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost font-extrabold text-3xl">
            <div className="flex items-center">
              <span className="text-2xl font-bold">
                <span className="text-pink-500">B</span>
                <span className="text-indigo-400">l</span>
                <span className="text-yellow-400">o</span>
                <span className="text-green-400">G</span>
                <span className="text-orange-500">o</span>
                <span className="text-blue-400">O</span>
                <span className="text-blue-500">o</span>
              </span>
            </div>
          </Link>
        </div>
        <div className="flex gap-5 me-3 items-center">
          <Search onSearchResults={onSearchResults} />
          {!isLoggedIn && (
            <>
              <Link to="/login" className="btn btn-outline btn-primary ml-2">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary ml-2">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

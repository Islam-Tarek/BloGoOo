import React from "react";
import { Link } from "react-router";

export default function AddBlogButton() {
  return (
    <div className="fixed w-5 h-5 bottom-1 right-1 m-5">
      <Link to="/newblog">
        <span className="btn btn-primary rounded-full animate-pulse font-extrabold">
          +
        </span>
      </Link>
    </div>
  );
}

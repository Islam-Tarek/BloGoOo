import React from "react";

export default function BlogForm() {
  return (
    <form className="blog-from flex flex-col w-2xl ms-36 py-3">
      <h2 className="form-title m-4 px-2 font-extrabold underline text-2xl">
        Create blog
      </h2>
      <div className="blog-image m-4">
        <span className="m-3 p-1 font-serif"> Add image </span>
        <input
          type="file"
          className="file-input file-input-primary m-3 p-1"
          vlaue="Choose Image"
        />
      </div>
      <div className="blog-caption m-4 p-4">
        <textarea
          type="text"
          placeholder="Write here..."
          className="textarea textarea-lg textarea-primary h-35 w-xl"
        ></textarea>
      </div>
      <div className="text-editor"></div>
      <div className="submit-btn m-4 p-4">
        <button className="btn btn-success p-2 font-extrabold">publish</button>

        {/* <input className="p-2" type="button" value="publish" /> */}
      </div>
    </form>
  );
}

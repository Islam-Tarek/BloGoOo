import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Blogs() {
  //   useEffect(() => {}) ==> we pass function to useEffect hook
  //1- without deps array
  // the inner function is rendered AFTER FIRST render & AFTER EVERY render

  //    useEffect(() => {}, [])
  //2- with empty deps array: => AFTER FIRST render ONLY

  //    useEffect(() => {}, [count1])
  //3- with deps array have values: => AFTER FIRST render & AFTER change of one of the values in deps array

  //4- clean up function
  //    a - Empty depndency array => BEFORE destroy the component
  //    b - Dependency array have value => BEFORE destroy the component & BEFORE NEXT effect

  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/blogs");

        setBlogs(response.data);
        console.log("data---->", response.data);
        setBlogs(response.data);
      } catch (err) {
        console.log("error while geting posts", err);
      }
    };
    fetchData();
  }, []);

  return (
    // in blog generator should give the blog-container is ms-36 and mt-5 mb-3
    <div className="blogs ms-28 py-3">
      {blogs.map((blg) => (
        <div
          key={blg.id}
          className="card bg-base-100 py-3 mb-10 w-2xl shadow-lg"
        >
          <div className="card-topbar flex justify-between mx-2">
            <h2 className="card-title m-1">Author Name</h2>
            <div className="post-settings dropdown dropdown-bottom m-1">
              <div
                tabIndex={0}
                role="button"
                className="btn m-1 -tracking-tighter"
              >
                ...
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-40 p-2 shadow-sm"
              >
                <li>
                  <a>UPDATE</a>
                </li>
                <li>
                  <a>DELETE</a>
                </li>
                <li>
                  <a>I Don't to see this</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="card-caption-box text-start m-2">
            <p className="card-caption m-1">{blg.caption}</p>
          </div>
          <figure className="px-3 py-3 m-2">
            <img src={blg.pictureUrl} alt="Shoes" className="rounded-xl m-1" />
          </figure>
          <div className="card-actions flex gap-5 ps-4 py-1.5 items-center text-center m-2">
            <button className="btn btn-primary">LIKE</button>
            <button className="btn btn-primary">COMMENT</button>
          </div>
        </div>
      ))}
    </div>
  );
}

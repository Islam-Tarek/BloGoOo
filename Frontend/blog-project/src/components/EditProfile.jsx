import React from "react";

export default function EditProfile() {
  return (
    <div className="edit-profile w-3xl ms-16 py-3">
      <h2 className="form-title m-4 px-2 font-extrabold underline text-2xl">
        Edit Profile
      </h2>
      <div className="profile-container p-4 flex justify-between">
        <form className="avatar flex flex-col p-2 m-2 ms-5 w-40">
          <div
            className="ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2 cursor-pointer"
            // onClick={handleImageClick}
          >
            <img
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <input
            type="file"
            // ref={fileInputRef}
            className="hidden"
            accept="image/*"
            // onChange={handleImageChange}
          />
          <div className="new-avatar -ms-3.5 mt-2 pt-1 ps-1 w-35 h-12 flex flex-col gap-2">
            <button className="btn btn-primary rounded-4xl w-33">
              Upload image
            </button>
          </div>
        </form>

        <div className="profile-data m-4 ms-8 ps-8 w-3xl flex flex-col">
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
              <input type="email" placeholder="mail@site.com" required />
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
              type="text"
              placeholder="Write here..."
              className="textarea textarea-lg textarea-primary h-35 w-96"
              name="bio"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}

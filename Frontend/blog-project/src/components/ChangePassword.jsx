import React from "react";
import axios from "axios";

export default function ChangePassword() {
  return (
    <form className="password-form flex flex-col w-2xl ms-36 py-3">
      <h2 className="form-title m-4 px-2 font-extrabold underline text-2xl">
        Chagne Password
      </h2>
      <div className="current-passowrd m-4 p-4">
        <span className="m-3 p-1 font-serif"> current Password </span>
        <input
          type="password"
          placeholder="write here.."
          className="input input-primary ms-10 font-bold"
        />
      </div>
      <div className="new-passowrd m-4 p-4">
        <span className="m-3 p-1 font-serif"> New Password </span>
        <input
          type="password"
          placeholder="write here.."
          className="input input-primary ms-14 font-bold"
        />
      </div>
      <div className="rewrite-new-passowrd m-4 p-4">
        <span className="m-3 p-1 font-serif"> Rewrite New Password </span>
        <input
          type="password"
          placeholder="write here.."
          className="input input-primary m-1 font-bold"
        />
      </div>
    </form>
  );
}

import React from "react";

export default function Error() {
  return (
    <div>
      <h1 className="text-4xl text-center mt-20 font-extrabold">
        <span className="text-pink-500">4</span>
        <span className="text-indigo-400">0</span>
        <span className="text-yellow-400">4</span>
        <span className="mx-2 text-gray-400">|</span>
        <span className="text-green-400">N</span>
        <span className="text-orange-500">o</span>
        <span className="text-blue-400">t</span>
        <span className="text-pink-500">&nbsp;F</span>
        <span className="text-indigo-400">o</span>
        <span className="text-yellow-400">u</span>
        <span className="text-green-400">n</span>
        <span className="text-orange-500">d</span>
      </h1>
      <div className="flex justify-center mt-10 gap-2">
        <span className="loading loading-infinity loading-xl text-pink-500 mt-8 animate-bounce"></span>
        <span className="loading loading-infinity loading-xl text-green-400 mt-4 animate-spin"></span>
        <span className="loading loading-infinity loading-xl text-orange-500 mt-8 animate-bounce"></span>
      </div>
    </div>
  );
}

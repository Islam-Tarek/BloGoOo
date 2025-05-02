import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { Link } from "react-router";

const schema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    rewritePassword: z.string(),
  })
  .refine((data) => data.password === data.rewritePassword, {
    message: "Passwords do not match",
    path: ["rewritePassword"],
  });

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    const URL = "http://localhost:3000/register";
    const { username, email, password } = data;
    try {
      const response = await axios.post(URL, {
        username,
        email,
        password,
        hiddenBlogs: [],
        profilePicture:
          "data:image/png;base64,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",
      });
      console.log("register response---->", response);
      reset();
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      // Optionally, show an error message to the user here
    }
  };

  return (
    <div className="min-h-screen w-full bg-base-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-base-100 rounded-lg shadow-xl p-8 border border-base-200">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">
              Create Account
            </h1>
            <p className="text-gray-400">Join our community</p>
          </div>

          <form
            className="space-y-5"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            {/* Username */}
            <div>
              <label
                className="block text-sm font-medium text-gray-300 mb-1"
                htmlFor="username"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                className={`w-full px-4 py-3 rounded-md border bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.username ? "border-red-500" : "border-gray-600"
                }`}
                {...register("username")}
                autoComplete="username"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                className="block text-sm font-medium text-gray-300 mb-1"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className={`w-full px-4 py-3 rounded-md border bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.email ? "border-red-500" : "border-gray-600"
                }`}
                {...register("email")}
                autoComplete="email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-sm font-medium text-gray-300 mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className={`w-full px-4 py-3 rounded-md border bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.password ? "border-red-500" : "border-gray-600"
                }`}
                {...register("password")}
                autoComplete="new-password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Rewrite Password */}
            <div>
              <label
                className="block text-sm font-medium text-gray-300 mb-1"
                htmlFor="rewritePassword"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="rewritePassword"
                placeholder="Confirm your password"
                className={`w-full px-4 py-3 rounded-md border bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.rewritePassword ? "border-red-500" : "border-gray-600"
                }`}
                {...register("rewritePassword")}
                autoComplete="new-password"
              />
              {errors.rewritePassword && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.rewritePassword.message}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full py-3 px-4 rounded-md"
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </button>
            </div>

            <div className="text-center text-gray-400 mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

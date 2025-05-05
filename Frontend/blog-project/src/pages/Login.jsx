import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";
import { Link } from "react-router";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const navigate = useNavigate();
  console.log("Login component rendered");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    console.log("Submitting", data); // Debug log
    const URL = `${import.meta.env.VITE_HOST}/login`;
    const { email, password } = data;
    try {
      const response = await axios.post(URL, {
        email,
        password,
      });

      Cookies.set("accessToken", response.data.accessToken, { expires: 7 });

      const payload = JSON.parse(atob(response.data.accessToken.split(".")[1]));
      Cookies.set("user", JSON.stringify(payload), { expires: 7 });

      reset();
      navigate("/");
    } catch (error) {
      console.error("Login failed--->", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-base-900 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="p-8 bg-base-100 rounded-lg shadow-xl border border-base-200">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
          </div>

          <form
            className="space-y-6"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className="space-y-5">
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
                  className={`w-full px-4 py-3 rounded-md border bg-gray-800/50 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.email ? "border-red-500" : "border-gray-700"
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
                  className={`w-full px-4 py-3 rounded-md border bg-gray-800/50 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.password ? "border-red-500" : "border-gray-700"
                  }`}
                  {...register("password")}
                  autoComplete="current-password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full py-3 px-4 rounded-md"
              onClick={() => console.log("Button clicked")}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>

            <div className="text-center text-gray-400 mt-4">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

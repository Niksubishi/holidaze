import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../api/auth.js";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../UI/LoadingSpinner";
import ErrorMessage from "../UI/ErrorMessage";
import SuccessMessage from "../UI/SuccessMessage";

const AuthForms = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    venueManager: false,
    avatar: {
      url: "",
      alt: "",
    },
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSignupChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("avatar.")) {
      const avatarField = name.split(".")[1];
      setSignupData((prev) => ({
        ...prev,
        avatar: {
          ...prev.avatar,
          [avatarField]: value,
        },
      }));
    } else {
      setSignupData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    if (error) setError("");
    if (success) setSuccess("");
  };

  const validateEmail = (email) => {
    return email.endsWith("@stud.noroff.no");
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const validateUsername = (name) => {
    return /^[a-zA-Z0-9_]+$/.test(name);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(loginData.email)) {
      setError("Please use a valid @stud.noroff.no email address");
      return;
    }

    if (!validatePassword(loginData.password)) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authAPI.login(loginData);
      const userData = response.data;

      await login(userData, userData.accessToken);
      setSuccess("Login successful! Redirecting...");

      setTimeout(() => {
        navigate("/venues");
      }, 1000);
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateUsername(signupData.name)) {
      setError("Username can only contain letters, numbers, and underscores");
      return;
    }

    if (!validateEmail(signupData.email)) {
      setError("Please use a valid @stud.noroff.no email address");
      return;
    }

    if (!validatePassword(signupData.password)) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (signupData.bio && signupData.bio.length > 160) {
      setError("Bio must be less than 160 characters");
      return;
    }

    if (signupData.avatar.alt && signupData.avatar.alt.length > 120) {
      setError("Avatar alt text must be less than 120 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Prepare signup data
      const userData = {
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
        venueManager: signupData.venueManager,
      };

      // Add optional fields only if they have values
      if (signupData.bio.trim()) {
        userData.bio = signupData.bio.trim();
      }

      if (signupData.avatar.url.trim()) {
        userData.avatar = {
          url: signupData.avatar.url.trim(),
          alt: signupData.avatar.alt.trim() || "",
        };
      }

      await authAPI.register(userData);
      setSuccess("Account created successfully! Please log in.");

      // Switch to login form after successful signup
      setTimeout(() => {
        setIsLogin(true);
        setLoginData({
          email: signupData.email,
          password: "",
        });
        setSuccess("");
      }, 2000);
    } catch (err) {
      console.error("Signup failed:", err);
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
          {/* Toggle Buttons */}
          <div className="flex mb-8">
            <button
              onClick={() => {
                setIsLogin(true);
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-2 px-4 font-chivo text-center transition-colors ${
                isLogin
                  ? "bg-primary text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-2 px-4 font-chivo text-center transition-colors ${
                !isLogin
                  ? "bg-primary text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error and Success Messages */}
          <ErrorMessage message={error} className="mb-4" />
          <SuccessMessage message={success} className="mb-4" />

          {/* Login Form */}
          {isLogin && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="login-email"
                  className="block font-lora text-sm text-gray-300 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  placeholder="your.name@stud.noroff.no"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary font-lora"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="block font-lora text-sm text-gray-300 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="login-password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary font-lora"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-primary text-white font-chivo rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <LoadingSpinner size="small" />
                    <span>Logging in...</span>
                  </div>
                ) : (
                  "Login"
                )}
              </button>
            </form>
          )}

          {/* Signup Form */}
          {!isLogin && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label
                  htmlFor="signup-name"
                  className="block font-lora text-sm text-gray-300 mb-2"
                >
                  Username *
                </label>
                <input
                  type="text"
                  id="signup-name"
                  name="name"
                  value={signupData.name}
                  onChange={handleSignupChange}
                  placeholder="your_username"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary font-lora"
                  required
                />
                <p className="font-lora text-gray-400 text-xs mt-1">
                  Only letters, numbers, and underscores allowed
                </p>
              </div>

              <div>
                <label
                  htmlFor="signup-email"
                  className="block font-lora text-sm text-gray-300 mb-2"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="signup-email"
                  name="email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  placeholder="your.name@stud.noroff.no"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary font-lora"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="signup-password"
                  className="block font-lora text-sm text-gray-300 mb-2"
                >
                  Password *
                </label>
                <input
                  type="password"
                  id="signup-password"
                  name="password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  placeholder="At least 8 characters"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary font-lora"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="signup-bio"
                  className="block font-lora text-sm text-gray-300 mb-2"
                >
                  Bio (optional)
                </label>
                <textarea
                  id="signup-bio"
                  name="bio"
                  value={signupData.bio}
                  onChange={handleSignupChange}
                  placeholder="Tell us about yourself (max 160 characters)"
                  maxLength="160"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary font-lora resize-none h-20"
                />
                <p className="font-lora text-gray-400 text-xs mt-1">
                  {signupData.bio.length}/160 characters
                </p>
              </div>

              <div>
                <label
                  htmlFor="signup-avatar-url"
                  className="block font-lora text-sm text-gray-300 mb-2"
                >
                  Avatar URL (optional)
                </label>
                <input
                  type="url"
                  id="signup-avatar-url"
                  name="avatar.url"
                  value={signupData.avatar.url}
                  onChange={handleSignupChange}
                  placeholder="https://example.com/your-avatar.jpg"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary font-lora"
                />
              </div>

              {signupData.avatar.url && (
                <div>
                  <label
                    htmlFor="signup-avatar-alt"
                    className="block font-lora text-sm text-gray-300 mb-2"
                  >
                    Avatar Alt Text (optional)
                  </label>
                  <input
                    type="text"
                    id="signup-avatar-alt"
                    name="avatar.alt"
                    value={signupData.avatar.alt}
                    onChange={handleSignupChange}
                    placeholder="Description of your avatar"
                    maxLength="120"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary font-lora"
                  />
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="venue-manager"
                  name="venueManager"
                  checked={signupData.venueManager}
                  onChange={handleSignupChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-600 rounded bg-gray-700"
                />
                <label
                  htmlFor="venue-manager"
                  className="ml-2 font-lora text-sm text-gray-300"
                >
                  Register as venue manager
                </label>
              </div>
              <p className="font-lora text-gray-400 text-xs">
                Venue managers can create and manage their own venues
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-primary text-white font-chivo rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <LoadingSpinner size="small" />
                    <span>Creating account...</span>
                  </div>
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForms;

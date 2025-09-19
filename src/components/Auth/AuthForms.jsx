import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../api/auth.js";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastContext";
import LoadingSpinner from "../UI/LoadingSpinner";
import ErrorMessage from "../UI/ErrorMessage";
import PasswordInput from "../UI/PasswordInput";
import {
  getCardBackground,
  getInputBackground,
  getInputBorderColor,
  getInputTextColor,
} from "../../utils/theme.js";

const AuthForms = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const { theme, isDarkMode } = useTheme();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    bio: "",
    venueManager: false,
    avatar: {
      url: "",
      alt: "",
    },
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
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

    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateEmail = (email) => {
    return email.endsWith("@stud.noroff.no");
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("Must be at least 8 characters long");
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("Must contain at least one lowercase letter");
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("Must contain at least one uppercase letter");
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push("Must contain at least one number");
    }
    return errors;
  };

  const validatePasswordMatch = (password, confirmPassword) => {
    return password === confirmPassword;
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

    const passwordErrors = validatePassword(loginData.password);
    if (passwordErrors.length > 0) {
      setError("Password " + passwordErrors[0].toLowerCase());
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authAPI.login(loginData);
      const userData = response.data;

      await login(userData, userData.accessToken);
      showSuccess("Welcome back!");

      setTimeout(() => {
        navigate("/venues");
      }, 1000);
    } catch (err) {
      const errorMessage = err.message || "Login failed";
      setError(errorMessage);
      showError(errorMessage);
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

    const passwordValidationErrors = validatePassword(signupData.password);
    if (passwordValidationErrors.length > 0) {
      setError("Password: " + passwordValidationErrors[0]);
      setPasswordErrors({ password: passwordValidationErrors[0] });
      return;
    }

    if (
      !validatePasswordMatch(signupData.password, signupData.confirmPassword)
    ) {
      setError("Passwords do not match");
      setPasswordErrors({ confirmPassword: "Passwords do not match" });
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
      const userData = {
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
        venueManager: signupData.venueManager,
      };

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
      showSuccess(
        "Account created successfully! Please log in with your new credentials."
      );

      setTimeout(() => {
        setIsLogin(true);
        setLoginData({
          email: signupData.email,
          password: "",
        });
      }, 1500);
    } catch (err) {
      const errorMessage = err.message || "Signup failed";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div className="w-full max-w-md">
        <div
          className="rounded-lg p-8 shadow-lg"
          style={{ backgroundColor: getCardBackground(isDarkMode) }}
        >
          <div className="flex mb-8">
            <button
              onClick={() => {
                setIsLogin(true);
                setError("");
                setPasswordErrors({});
              }}
              className={`flex-1 py-2 px-4 font-poppins text-center transition-colors cursor-pointer ${
                isLogin ? "bg-primary" : `hover:opacity-80`
              }`}
              style={{
                backgroundColor: isLogin
                  ? "#489DA6"
                  : isDarkMode
                  ? "#4b5563"
                  : "#e5e7eb",
                color: isLogin ? "white" : theme.colors.text,
              }}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError("");
                setPasswordErrors({});
              }}
              className={`flex-1 py-2 px-4 font-poppins text-center transition-colors cursor-pointer ${
                !isLogin ? "bg-primary" : `hover:opacity-80`
              }`}
              style={{
                backgroundColor: !isLogin
                  ? "#489DA6"
                  : isDarkMode
                  ? "#4b5563"
                  : "#e5e7eb",
                color: !isLogin ? "white" : theme.colors.text,
              }}
            >
              Sign Up
            </button>
          </div>

          <ErrorMessage message={error} className="mb-4" />

          {isLogin && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="login-email"
                  className="block font-poppins text-sm mb-2"
                  style={{ color: theme.colors.text, opacity: 0.8 }}
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
                  className="w-full px-3 py-2 rounded-lg focus:outline-none font-poppins"
                  style={{
                    backgroundColor: getInputBackground(isDarkMode),
                    borderColor: getInputBorderColor(isDarkMode),
                    color: getInputTextColor(isDarkMode),
                  }}
                  required
                />
              </div>

              <PasswordInput
                id="login-password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                placeholder="Enter your password"
                label="Password"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-primary text-white font-poppins rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 cursor-pointer"
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

          {!isLogin && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label
                  htmlFor="signup-name"
                  className="block font-poppins text-sm mb-2"
                  style={{ color: theme.colors.text, opacity: 0.8 }}
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
                  className="w-full px-3 py-2 rounded-lg focus:outline-none font-poppins"
                  style={{
                    backgroundColor: getInputBackground(isDarkMode),
                    borderColor: getInputBorderColor(isDarkMode),
                    color: getInputTextColor(isDarkMode),
                  }}
                  required
                />
                <p
                  className="font-poppins text-xs mt-1"
                  style={{ color: theme.colors.text, opacity: 0.6 }}
                >
                  Only letters, numbers, and underscores allowed
                </p>
              </div>

              <div>
                <label
                  htmlFor="signup-email"
                  className="block font-poppins text-sm mb-2"
                  style={{ color: theme.colors.text, opacity: 0.8 }}
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
                  className="w-full px-3 py-2 rounded-lg focus:outline-none font-poppins"
                  style={{
                    backgroundColor: getInputBackground(isDarkMode),
                    borderColor: getInputBorderColor(isDarkMode),
                    color: getInputTextColor(isDarkMode),
                  }}
                  required
                />
              </div>

              <PasswordInput
                id="signup-password"
                name="password"
                value={signupData.password}
                onChange={handleSignupChange}
                placeholder="At least 8 characters (A-Z, a-z, 0-9)"
                label="Password"
                required
                error={passwordErrors.password}
              />

              <PasswordInput
                id="signup-confirm-password"
                name="confirmPassword"
                value={signupData.confirmPassword}
                onChange={handleSignupChange}
                placeholder="Repeat your password"
                label="Confirm Password"
                required
                error={passwordErrors.confirmPassword}
              />

              <div>
                <label
                  htmlFor="signup-bio"
                  className="block font-poppins text-sm mb-2"
                  style={{ color: theme.colors.text, opacity: 0.8 }}
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
                  className="w-full px-3 py-2 rounded-lg focus:outline-none font-poppins resize-none h-20"
                  style={{
                    backgroundColor: getInputBackground(isDarkMode),
                    borderColor: getInputBorderColor(isDarkMode),
                    color: getInputTextColor(isDarkMode),
                  }}
                />
                <p
                  className="font-poppins text-xs mt-1"
                  style={{ color: theme.colors.text, opacity: 0.6 }}
                >
                  {signupData.bio.length}/160 characters
                </p>
              </div>

              <div>
                <label
                  htmlFor="signup-avatar-url"
                  className="block font-poppins text-sm mb-2"
                  style={{ color: theme.colors.text, opacity: 0.8 }}
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
                  className="w-full px-3 py-2 rounded-lg focus:outline-none font-poppins"
                  style={{
                    backgroundColor: getInputBackground(isDarkMode),
                    borderColor: getInputBorderColor(isDarkMode),
                    color: getInputTextColor(isDarkMode),
                  }}
                />
              </div>

              {signupData.avatar.url && (
                <div>
                  <label
                    htmlFor="signup-avatar-alt"
                    className="block font-poppins text-sm mb-2"
                    style={{ color: theme.colors.text, opacity: 0.8 }}
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
                    className="w-full px-3 py-2 rounded-lg focus:outline-none font-poppins"
                    style={{
                      backgroundColor: isDarkMode ? "#4b5563" : "#ffffff",
                      borderColor: isDarkMode ? "#6b7280" : "#d1d5db",
                      color: isDarkMode ? "#ffffff" : "#132F3D",
                    }}
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
                  className="h-4 w-4 text-primary focus:ring-primary rounded"
                  style={{
                    backgroundColor: isDarkMode ? "#4b5563" : "#ffffff",
                    borderColor: isDarkMode ? "#6b7280" : "#d1d5db",
                  }}
                />
                <label
                  htmlFor="venue-manager"
                  className="ml-2 font-poppins text-sm"
                  style={{ color: theme.colors.text, opacity: 0.8 }}
                >
                  Register as venue manager
                </label>
              </div>
              <p
                className="font-poppins text-xs"
                style={{ color: theme.colors.text, opacity: 0.6 }}
              >
                Venue managers can create and manage their own venues
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-primary text-white font-poppins rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 cursor-pointer"
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

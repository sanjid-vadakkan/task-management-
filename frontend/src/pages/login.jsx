import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { FaFacebook, FaApple } from 'react-icons/fa';
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from 'react-router-dom';
import API from "../utils/axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call - replace with your actual login API
      const response = await API.post('/users/login',formData); 
console.log(response);

      if (response.data) {
        
            toast.success("Registration successful!");
            dispatch(setUser({ userData: response.data.user, token: response.data.token }))
            navigate('/')
        // Handle successful login
   
        
        // Redirect to dashboard or home page
        
      } 
    } catch (error) {
      console.error('Login error:', error.response.data);
     const errorMessage =
    error.response?.data?.error || "Network error. Please try again.";
  setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle social login
  const handleSocialLogin = (provider) => {
    // Implement social login logic here
    console.log(`Logging in with ${provider}`);
    
    
  }
  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen px-4" style={{
        backgroundImage: "url('src/assets/bg.jpg') ", backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
        <div className="w-full max-w-xl bg-white/60 shadow-lg rounded-[2.5rem] p-6 md:p-12 flex flex-col items-center backdrop-blur-[2px] border border-gray-200 hover:shadow-xl hover:bg-white/70 transition-all duration-300">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-600 mb-2 mt-6 text-center hover:text-blue-700 transition-colors duration-200">Login</h2>
          <p className="text-gray-700 text-center mb-6 max-w-sm">
            Welcome back! Sign in using your <br /> social account or email to continue us
          </p>
          
          {/* Social Icons */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <button 
              onClick={() => handleSocialLogin('facebook')}
              className="bg-white text-2xl text-blue-600 rounded-full p-2 shadow hover:scale-110 hover:shadow-lg hover:bg-blue-50 transition-all duration-200"
            >
              <FaFacebook />
            </button>
            <button 
              onClick={() => handleSocialLogin('google')}
              className="bg-white text-2xl text-red-600 rounded-full p-2 shadow hover:scale-110 hover:shadow-lg hover:bg-red-50 transition-all duration-200"
            >
              <FcGoogle />
            </button>
            <button 
              onClick={() => handleSocialLogin('apple')}
              className="bg-white text-2xl text-gray-600 rounded-full p-2 shadow hover:scale-110 hover:shadow-lg hover:bg-gray-50 transition-all duration-200"
            >
              <FaApple />
            </button>
          </div>

          {/* Error message */}
          {errors.submit && (
            <div className="w-full mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-xl text-sm text-center">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
            <div className="bg-white rounded-xl px-4 py-3 shadow-sm flex flex-col hover:shadow-md hover:bg-gray-50/50 transition-all duration-200 group">
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-transparent outline-none border-0 border-b border-gray-300 focus:border-blue-500 hover:border-gray-400 transition-all duration-200 px-0 py-2 text-base"
              />
              {errors.email && (
                <span className="text-red-500 text-xs mt-1">{errors.email}</span>
              )}
            </div>
            
            <div className="bg-white rounded-xl px-4 py-3 shadow-sm flex flex-col hover:shadow-md hover:bg-gray-50/50 transition-all duration-200 group">
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="bg-transparent outline-none border-0 border-b border-gray-300 focus:border-blue-500 hover:border-gray-400 transition-all duration-200 px-0 py-2 text-base"
              />
              {errors.password && (
                <span className="text-red-500 text-xs mt-1">{errors.password}</span>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="mt-3 w-40 bg-white mx-auto rounded-xl py-3 text-lg font-semibold shadow-md hover:shadow-xl hover:bg-blue-500 hover:text-white hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] border border-gray-200 hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black disabled:hover:transform-none"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <p className="text-sm text-gray-700 text-center mt-4">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline font-medium">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
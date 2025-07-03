import React, { useState } from "react";
import { FaFacebook, FaApple } from 'react-icons/fa';
import { FcGoogle } from "react-icons/fc";
import Navbar from "../components/navbar.jsx";
import API from "../utils/axios";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/authSlice";

// React Router Link replacement




const Register = () => {

    const Navigate = useNavigate()
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});

    // Email validation
    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Password validation (minimum requirements)
    const validatePassword = (password) => {
        return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        // Clear errors when user starts typing
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        const newErrors = {};

        // Email validation
        if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!validatePassword(formData.password)) {
            newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // If validation passes
        console.log('Registration successful:', formData);


        // Reset form

        setErrors({});

        try {

            const response = await API.post("/users/register", formData);
            console.log(response.data);

            // Success: Reset form

            setErrors({});
            toast.success("Registration successful!");
            dispatch(setUser({ userData: response.data.user, token: response.data.token }))
            Navigate('/')
        } catch (error) {

            if (error.response && error.response.data?.error) {
                setErrors({
                    ...errors,
                    checkEmail: error.response.data?.error
                });

                // Backend error (e.g., "User already exists")

            } else {
                alert("❌ Something went wrong");
            }
        }



    };

    return (
        <>
            <Navbar />
            <div className="flex items-center justify-center min-h-screen px-4" style={{
                backgroundImage: "url('src/assets/bg.jpg') ", backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}>
                <div className="w-full max-w-xl bg-white/60 shadow-lg rounded-[2.5rem] p-6 md:p-12 flex flex-col items-center backdrop-blur-[2px] border border-gray-200 hover:shadow-xl hover:bg-white/70 transition-all duration-300">
                    <h2 className="text-2xl md:text-3xl font-bold text-blue-600 mb-2 mt-6 text-center hover:text-blue-700 transition-colors duration-200">Register</h2>
                    <p className="text-gray-700 text-center mb-6 max-w-sm">
                        Welcome back! Sign in using your <br /> social account or email to continue us
                    </p>

                    {/* Social Icons */}
                    <div className="flex items-center justify-center gap-6 mb-8">
                        <button className="bg-white text-2xl text-blue-600 rounded-full p-2 shadow hover:scale-110 hover:shadow-lg hover:bg-blue-50 transition-all duration-200 "><FaFacebook /></button>
                        <button className="bg-white text-2xl text-red-600 rounded-full p-2 shadow hover:scale-110 hover:shadow-lg hover:bg-red-50 transition-all duration-200"><FcGoogle /></button>
                        <button className="bg-white text-2xl text-gray-600 rounded-full p-2 shadow hover:scale-110 hover:shadow-lg hover:bg-gray-50 transition-all duration-200"><FaApple /></button>
                    </div>

                    <div className="w-full flex flex-col gap-5">
                        <div className="bg-white rounded-xl px-4 py-3 shadow-sm flex flex-col hover:shadow-md hover:bg-gray-50/50 transition-all duration-200 group">
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="bg-transparent outline-none border-0 border-b border-gray-300 focus:border-blue-500 hover:border-gray-400 transition-all duration-200 px-0 py-2 text-base"
                            />
                        </div>

                        <div className="bg-white rounded-xl px-4 py-3 shadow-sm flex flex-col hover:shadow-md hover:bg-gray-50/50 transition-all duration-200 group">
                            <input
                                id="email"
                                type="email"
                                name="email"
                                required
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="bg-transparent outline-none border-0 border-b border-gray-300 focus:border-blue-500 hover:border-gray-400 transition-all duration-200 px-0 py-2 text-base"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            {errors.checkEmail && <p className="text-red-500 text-sm mt-1">{errors.checkEmail}</p>}
                        </div>

                        <div className="bg-white rounded-xl px-4 py-3 shadow-sm flex flex-col hover:shadow-md hover:bg-gray-50/50 transition-all duration-200 group">
                            <input
                                id="password"
                                type="password"
                                name="password"
                                required
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="bg-transparent outline-none border-0 border-b border-gray-300 focus:border-blue-500 hover:border-gray-400 transition-all duration-200 px-0 py-2 text-base"
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>

                        <button
                            onClick={handleSubmit}
                            type="submit"
                            className="mt-3 w-40 bg-white mx-auto rounded-xl py-3 text-lg font-semibold shadow-md hover:shadow-xl hover:bg-blue-500 hover:text-white hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] border border-gray-200 hover:border-blue-500"
                        >
                            Register
                        </button>
                    </div>

                    <p className="text-sm text-gray-700 text-center mt-4">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 hover:underline font-medium">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Register;
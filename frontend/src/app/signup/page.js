'use client'
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // Use useEffect to watch for changes in password or confirmPassword and enable/disable the button accordingly
  useEffect(() => {
    if (password && confirmPassword && password === confirmPassword) {
      setIsButtonDisabled(false); // Enable the button when passwords match
    } else {
      setIsButtonDisabled(true); // Disable the button when passwords don't match
    }
  }, [password, confirmPassword]);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Please provide your name");
      return; 
    }
    if (!email) {
      toast.error("Please provide your email");
      return; 
    }
    if (!password) {
      toast.error("Please provide the password");
      return; 
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/admin/signup",
        { name, email, password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      console.dir(  "my response" , response.response)
      if(response.status==200){
        // console.dir(response.data.msg)
        toast.success(response.response.data.msg||"Signup succes");
        // console.dir(response)
      setIsAuthenticated(true); 
      }
      else{
        toast.error(response.response.data.msg|| "An error occurred during registration");
      }
     
    } catch (error) {
      // console.log(error);
      if (error.response) {
        
        toast.error(error.message|| "An error occurred during registration");
      } else {
        toast.error("Unable to connect to the server, please try again later");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <div className="flex justify-center mb-4">
          <FontAwesomeIcon icon={faUserPlus} className="text-blue-500 text-4xl" />
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            {password && confirmPassword && password !== confirmPassword && (
              <p className="text-red-500 text-sm mt-2">Passwords do not match</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isButtonDisabled}  
            className={`w-full bg-blue-500 text-white font-bold p-3 rounded-lg transition duration-200 ${isButtonDisabled ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-blue-600'}`}
          >
            Sign Up
          </button>
          <ToastContainer />
        </form>

        <p className="mt-4 text-center">
          {`Already have an account? `}
          <a href="/login" className="text-blue-500 hover:text-blue-700 font-bold">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;

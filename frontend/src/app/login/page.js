'use client'
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response=await axios
        .post(
          `http://localhost:5000/admin/login`,
          { email, password },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
        console.log(response.data);
        // toast.success(response.data.message );
        //   setIsAuthenticated(true);
        //    setEmail(""); 
        //   setPassword("");
         
      
    } catch (error) {
      
       toast.error(error.response.data.message);
    }
  };

 
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        
        <div className="flex justify-center mb-4">
          <FontAwesomeIcon icon={faUser} className="text-blue-500 text-4xl mr-2" />
         
        </div>
        
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        
        <form onSubmit={handleLogin}>
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
          
          <div className="mb-6">
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
          
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold p-3 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center">
          {`Don't have an account? `}
          <a href="/signup" className="text-blue-500 hover:text-blue-700 font-bold">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;


'use client'
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation

function SignIn() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter(); // Initialize useRouter



    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("user:", username, "pass:", password);

        try {
          // Check if the user exists
          const response = await axios.post('api/auth', {
              action: 'login',
              username,
              password
          }, {
              headers: {
                  'Content-Type': 'application/json'
              }
          });        
        
        if (response.status === 200 && response.data.exists) {
                  alert("Logged in successfully");
                  router.push('/dashboard'); 
          } else {
              alert("User not found");
          }
      } catch (error) {
          console.error("An error occurred:", error);
          alert("User not found");
      }
    };

    return (
        <section className="bg-white">
            <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
                <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
                    <img
                        alt=""
                        src="https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                </aside>

                <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
                    <div className="max-w-xl lg:max-w-3xl">
                        <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                            Welcome to Workspace Loop ♾️
                        </h1>

                        <p className="mt-4 leading-relaxed text-gray-500">
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi nam dolorum aliquam,
                            quibusdam aperiam voluptatum.
                        </p>

                        <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-6 gap-6">
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                    Username
                                </label>

                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm p-4"
                                    style={{ borderColor: '#e4f0f3', borderWidth: '2px' }}
                                />
                            </div>


                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="Password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    id="Password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 w-full rounded-md border-black bg-white text-sm text-gray-700 shadow-sm p-4"
                                    style={{ borderColor: '#e4f0f3', borderWidth: '2px' }}
                                />
                            </div>


                            <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                                <button
                                    type="submit"
                                    className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                                >
                                    Log In
                                </button>

                                <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                                    Don't have an account?
                                    <a href="/signup" className="text-gray-700 underline">
                                        Sign Up
                                    </a>
                                    .
                                </p>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </section>
    );
}

export default SignIn;

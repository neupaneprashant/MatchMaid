import React from "react";

function Header() {
  return (
    <header className="bg-white shadow-md p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-pink-600 mb-4">MatchMaid</h1>
      
      <form className="bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-sm space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            id="username"
            type="text"
            name="username"
            required
            placeholder="Enter Username"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            required
            placeholder="Enter Password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
          />
        </div>

        <div className="flex items-center">
          <input
            id="remember"
            type="checkbox"
            defaultChecked
            className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
          />
          <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
            Remember me
          </label>
        </div>

        <div className="flex justify-between items-center space-x-2">
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700 transition"
          >
            Login
          </button>
          <button
            type="button"
            className="w-full bg-gray-400 text-white py-2 rounded-md hover:bg-gray-500 transition"
          >
            Cancel
          </button>
        </div>

        <div className="text-sm text-center text-gray-600">
          Forgot your{" "}
          <a href="#" className="text-pink-600 hover:underline">
            password?
          </a>
        </div>
      </form>
    </header>
  );
}

export default Header;

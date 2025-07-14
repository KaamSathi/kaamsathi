"use client"

import type React from "react"
import Link from "next/link"

const Header: React.FC = () => {
  const handleAuthClick = (type: "login" | "signup") => {
    // Implement user intent modal logic here
    alert(`Open ${type} modal`) // Replace with actual modal implementation
  }

  return (
    <header className="bg-gray-100 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          My App
        </Link>

        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="hover:text-gray-500">
                Home
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-gray-500">
                Products
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-gray-500">
                Blog
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <button
            onClick={() => handleAuthClick("login")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
          >
            Login
          </button>
          <button
            onClick={() => handleAuthClick("signup")}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign Up
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header

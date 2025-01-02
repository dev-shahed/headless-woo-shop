import React, { useEffect, useState } from "react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useProducts } from "../ProductContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { getCartCount } = useProducts();

  const navigation = {
    pages: [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
    ],
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            <span className="sr-only">Open menu</span>
          </button>

          {/* Logo */}
          <a href="/" className="flex items-center">
            <img
              className="h-8 w-auto"
              src="https://upload.wikimedia.org/wikipedia/commons/2/2a/WooCommerce_logo.svg"
              alt="Your Company"
            />
            <span className="ml-2 text-xl font-bold text-gray-800">
              ShopEasy
            </span>
          </a>

          {/* Navigation Links */}
          <div className="hidden lg:flex space-x-8">
            {navigation.pages.map((page) => (
              <a
                key={page.name}
                href={page.href}
                className="text-sm font-medium text-gray-700 hover:text-indigo-600"
              >
                {page.name}
              </a>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-6">
            <a
              href="#"
              className="text-gray-400 hover:text-gray-600"
              aria-label="Search"
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-gray-600"
              aria-label="User Account"
            >
              <UserIcon className="h-6 w-6" />
            </a>
            <Link
              to={"/cart"}
              className="flex items-center text-gray-400 hover:text-gray-600"
              aria-label="Shopping Cart"
            >
              <ShoppingBagIcon className="h-6 w-6" />
              <span className="ml-1 text-sm font-medium">{getCartCount()}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          {/* Pages */}
          <div className="flex justify-center space-x-4 py-4">
            {navigation.pages.map((page) => (
              <a
                key={page.name}
                href={page.href}
                className="px-4 py-2 text-gray-700 hover:text-indigo-600"
              >
                {page.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

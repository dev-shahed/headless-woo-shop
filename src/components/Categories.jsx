import React from "react";

const categories = [
  { name: "Men", href: "/men" },
  { name: "Women", href: "/women" },
  { name: "Kids", href: "/kids" },
  { name: "Accessories", href: "/accessories" },
];

export default function Categories() {
  return (
    <div className="bg-gray-50 py-4 my-2 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl md:px-6 lg:flex justify-start space-x-8">
        {categories.map((category) => (
          <a
            key={category.name}
            href={category.href}
            className="text-sm font-medium text-gray-700 hover:text-indigo-600"
          >
            {category.name}
          </a>
        ))}
      </div>
    </div>
  );
}

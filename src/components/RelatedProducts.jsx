import React from "react";
import PropTypes from "prop-types";
import { useProducts } from "../ProductContext";
import { Link } from "react-router-dom";

export default function RelatedProducts({ theProduct }) {
  const { products, loading, error } = useProducts();
  if (loading) return <div className="text-center">Loading related products...</div>;
  if (error) return <div>{error}</div>;
  const productName = theProduct.name;

  // Filter related products: excluding the current product
  const relatedProd = products?.filter((product) => {
    // Exclude the current product
    if (product.id === theProduct.id) return false;
    // Check if product name or category matches
    const isNameMatch = product.name
      .toLowerCase()
      .includes(productName.toLowerCase());

    const isCategoryMatch = product.categories.some((category) =>
      category.name.toLowerCase().includes(productName.toLowerCase())
    );
    return isNameMatch || isCategoryMatch;
  });

  return (
    <div className="mx-auto mt-24 max-w-2xl sm:mt-32 lg:max-w-none">
      <div className="flex items-center justify-between space-x-4">
        <h2 className="text-lg font-medium text-gray-900">
          Customers also viewed
        </h2>
        <a
          href="#"
          className="whitespace-nowrap text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          View all
          <span aria-hidden="true"> &rarr;</span>
        </a>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
        {relatedProd?.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all ease-in-out duration-200"
          >
            <div className="aspect-h-3 aspect-w-4 overflow-hidden rounded-t-lg bg-gray-100">
              <img
                src={product.images[0].src}
                alt={product.images[0].alt || product.name} // Fallback alt text if not available
                className="object-cover object-center w-full h-full"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {product.name}
                </h3>
                <p className="text-lg font-medium text-gray-900">
                  ${product.price}
                </p>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {product.categories?.map((category, index) => (
                  <span key={category.id}>
                    {category.name}
                    {index < product.categories.length - 1 && ", "}
                  </span>
                ))}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

RelatedProducts.propTypes = {
  theProduct: PropTypes.object.isRequired,
};

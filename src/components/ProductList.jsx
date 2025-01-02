import React, { Fragment } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useProducts } from "../ProductContext";

const ProductList = () => {
  const { products, loading, error } = useProducts();
  if (loading) return <div className="text-center mt-6">Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Fragment>
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold text-center mb-8">Products</h2>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl"
            >
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.images[0].src}
                  alt={product.name}
                  className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
                />
              </Link>
              <div className="p-4">
                <h3 className="text-sm text-gray-700">{product.name}</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  ${product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
};

export default ProductList;

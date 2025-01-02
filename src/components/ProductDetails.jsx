import { Fragment, useEffect, useState } from "react";
import { Radio, RadioGroup } from "@headlessui/react";

import { StarIcon } from "@heroicons/react/20/solid";
import { useParams } from "react-router-dom";
import axios from "axios";
import Categories from "./Categories";
import RelatedProducts from "./RelatedProducts";
import { useProducts } from "../ProductContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");



  const [cartLoading, setCartLoading] = useState(false);
  const { addToCart } = useProducts();

  const reviews = {
    average: product?.average_rating,
    totalCount: product?.rating_count,
    featured: [
      {
        id: 1,
        title: "Can't say enough good things",
        rating: 5,
        content: `
            <p>I was really pleased with the overall shopping experience. My order even included a little personal, handwritten note, which delighted me!</p>
            <p>The product quality is amazing, it looks and feel even better than I had anticipated. Brilliant stuff! I would gladly recommend this store to my friends. And, now that I think of it... I actually have, many times!</p>
          `,
        author: "Risako M",
        date: "May 16, 2021",
        datetime: "2021-01-06",
      },
      // More reviews...
    ],
  };

  useEffect(() => {
    axios
      .get(`http://localhost:10003/wp-json/wc/v3/products/${productId}`, {
        params: {
          consumer_key: "ck_cdef8d712f469e40121084ddcd750b78c8b25477",
          consumer_secret: "cs_677a0b2deaa1a22bd964e0cf51d5813ef4b94848",
        },
      })
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching product details");
        setLoading(false);
      });
  }, [productId]);

  if (loading) return <div className="text-center mt-6">Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Fragment>
      <Categories />
      <main className="mx-auto mt-8 max-w-2xl px-4 pb-16 sm:px-6 sm:pb-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">
          {/* Product Details */}
          <div className="lg:col-span-5 lg:col-start-8">
            <div className="flex justify-between">
              <h1 className="text-xl font-medium text-gray-900">
                {product.name}
              </h1>
              <p className="text-xl font-medium text-gray-900">
                ${product.price}
              </p>
            </div>

            {/* Reviews Section */}
            <div className="mt-4">
              <h2 className="sr-only">Reviews</h2>
              <div className="flex items-center">
                <p className="text-sm text-gray-700">
                  {reviews.average}
                  <span className="sr-only"> out of 5 stars</span>
                </p>
                <div className="ml-1 flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        reviews.average > rating
                          ? "text-yellow-400"
                          : "text-gray-200",
                        "h-5 w-5 flex-shrink-0"
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <div aria-hidden="true" className="ml-4 text-sm text-gray-300">
                  ·
                </div>
                <div className="ml-4 flex">
                  <a
                    href="#"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    See all {reviews.totalCount} reviews
                  </a>
                </div>
              </div>
            </div>
            {/* Stock status */}
            <div className="mt-4 flex items-center space-x-2 text-md font-medium">
              <span className="text-blue-600">Stock Status:</span>
              <span
                className={classNames(
                  product.stock_status === "instock"
                    ? "text-green-600 bg-green-100"
                    : "text-red-600 bg-red-100",
                  "px-2 py-1 rounded-md"
                )}
              >
                {product.stock_status === "instock"
                  ? "In Stock"
                  : "Out of Stock"}
              </span>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="mt-8 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
            <h2 className="sr-only">Images</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-3 lg:gap-8">
              {product?.images?.length > 0 ? (
                product.images.map((image, index) => (
                  <img
                    key={image.id}
                    src={image.src}
                    alt={image.alt}
                    className={classNames(
                      index === 0
                        ? "lg:col-span-2 lg:row-span-2"
                        : "hidden lg:block",
                      "rounded-lg"
                    )}
                  />
                ))
              ) : (
                <div>No images available</div>
              )}
            </div>
          </div>

          {/* Product Configuration */}
          <div className="mt-8 lg:col-span-5">
            <form>
              {product.type === "variable" && (
                <div>
                  {/* Dynamically Find Color Attribute */}
                  {product?.attributes?.find(
                    (attr) => attr.name.toLowerCase() === "color"
                  ) && (
                    <div>
                      <h2 className="text-sm font-medium text-gray-900">
                        Color
                      </h2>
                      <fieldset aria-label="Choose a color" className="mt-2">
                        <RadioGroup
                          value={selectedColor}
                          onChange={setSelectedColor}
                          className="flex items-center space-x-3"
                        >
                          {product.attributes
                            .find((attr) => attr.name.toLowerCase() === "color")
                            ?.options?.map((color) => (
                              <Radio
                                key={color}
                                value={color}
                                aria-label={color}
                                className={({ focus, checked }) =>
                                  classNames(
                                    focus && checked
                                      ? "ring ring-offset-1"
                                      : "",
                                    !focus && checked ? "ring-2" : "",
                                    "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none"
                                  )
                                }
                              >
                                <span
                                  aria-hidden="true"
                                  className={classNames(
                                    color === "Blue" && "bg-blue-600",
                                    color === "Green" && "bg-green-600",
                                    color === "Red" && "bg-red-600",
                                    color === "Yellow" && "bg-yellow-400",
                                    color === "Gray" && "bg-gray-300",
                                    "h-8 w-8 rounded-full border border-black border-opacity-10"
                                  )}
                                />
                              </Radio>
                            ))}
                        </RadioGroup>
                      </fieldset>
                    </div>
                  )}

                  {/* Dynamically Find Size Attribute */}
                  {product?.attributes?.find(
                    (attr) => attr.name.toLowerCase() === "size"
                  ) && (
                    <div className="mt-8">
                      <div className="flex items-center justify-between">
                        <h2 className="text-sm font-medium text-gray-900">
                          Size
                        </h2>
                        <a
                          href="#"
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          See sizing chart
                        </a>
                      </div>
                      <fieldset aria-label="Choose a size" className="mt-2">
                        <RadioGroup
                          value={selectedSize}
                          onChange={setSelectedSize}
                          className="grid grid-cols-3 gap-3 sm:grid-cols-6"
                        >
                          {product.attributes
                            .find((attr) => attr.name.toLowerCase() === "size")
                            ?.options?.map((size) => (
                              <Radio
                                key={size}
                                value={size}
                                className={({ focus, checked }) =>
                                  classNames(
                                    product?.stock_status === "instock"
                                      ? "cursor-pointer focus:outline-none"
                                      : "cursor-not-allowed opacity-25",
                                    focus
                                      ? "ring-2 ring-indigo-500 ring-offset-2"
                                      : "",
                                    checked
                                      ? "border-transparent bg-indigo-600 text-white hover:bg-indigo-700"
                                      : "border-gray-200 bg-white text-gray-900 hover:bg-gray-50",
                                    "flex items-center justify-center rounded-md border py-3 px-3 text-sm font-medium uppercase sm:flex-1"
                                  )
                                }
                                disabled={!product?.stock_status === "instock"}
                              >
                                {size}
                              </Radio>
                            ))}
                        </RadioGroup>
                      </fieldset>
                    </div>
                  )}
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={() => addToCart(product)}
                disabled={cartLoading}
                className="mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {cartLoading ? "Adding to cart..." : "Add to cart"}
              </button>
            </form>

            {/* Product Details */}
            <div className="mt-10">
              <h2 className="text-sm font-medium text-gray-900">Description</h2>
              <div
                className="prose prose-sm mt-4 text-gray-500"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>

            {/* Additional Information */}
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h2 className="text-sm font-medium text-gray-900">
                Fabric &amp; Care
              </h2>
              {/* <div className="prose prose-sm mt-4 text-gray-500">
              <ul role="list">
                {product?.details?.map((item) => (ß
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div> */}
            </div>
          </div>
        </div>
        <RelatedProducts theProduct = {product}/>
      </main>
    </Fragment>
  );
};

export default ProductDetails;

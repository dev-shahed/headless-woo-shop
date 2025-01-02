import { CheckIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function CartItem() {
  const cartData = localStorage.getItem("cart");
  const [cart, setCart] = useState(cartData ? JSON.parse(cartData) : []);
  const subTotal = cart.reduce((total, item) => total + Number(item.price) * item.quantity, 0);

  const removeItem = (id) => {
    const newCart = cart.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(newCart));
    setCart(newCart); // Update state to trigger a re-render
  };

  const syncCartAndRedirect = async () => {
    const siteDomain = "http://localhost:10003"; // WordPress site domain
    const endpoint = `${siteDomain}/wp-json/wc/v3/cart`; // WooCommerce Cart API endpoint

    const preparedCartData = cart.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
    }));

    try {
      const response = await axios.post(
        endpoint,
        { items: preparedCartData },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${import.meta.env.VITE_BASIC_AUTH_TOKEN}`,
          },
        }
      );

      const { session_id } = response.data;

      if (session_id) {
        window.location.href = `${siteDomain}/checkout?session_id=${session_id}`;
      } else {
        throw new Error("Session ID not returned from WooCommerce");
      }
    } catch (error) {
      console.error("Error syncing cart with WooCommerce:", error);
      alert("There was an issue syncing your cart. Please try again.");
    }
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-0">
        <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>

        <form className="mt-12">
          <section aria-labelledby="cart-heading">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul className="divide-y divide-gray-200 border-b border-t border-gray-200">
              {cart.map((product) => (
                <li key={product.id} className="flex py-6">
                  <div className="flex-shrink-0">
                    <img
                      src={product?.images[0]?.src}
                      alt={product?.name}
                      className="h-24 w-24 rounded-md object-cover object-center sm:h-32 sm:w-32"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col sm:ml-6">
                    <div>
                      <div className="flex justify-between">
                        <h4 className="text-sm">
                          <Link
                            to={`/product/${product.id}`}
                            className="font-medium text-gray-700 hover:text-gray-800"
                          >
                            {product.name}
                          </Link>
                        </h4>
                        <p className="ml-4 text-sm font-medium text-gray-900">
                          ${Number(product.price).toFixed(2)}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                      <p className="mt-1 text-sm text-gray-500">{product.size}</p>
                      <p className="mt-1 text-sm text-gray-500">Quantity: {product.quantity}</p>
                    </div>

                    <div className="mt-4 flex flex-1 items-end justify-between">
                      <p className="flex items-center space-x-2 text-sm text-gray-700">
                        {product.inStock ? (
                          <CheckIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
                        ) : (
                          <ClockIcon className="h-5 w-5 text-gray-300" aria-hidden="true" />
                        )}
                        <span>
                          {product.inStock ? "In stock" : `Will ship in ${product.leadTime}`}
                        </span>
                      </p>
                      <button
                        onClick={() => removeItem(product.id)}
                        type="button"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="summary-heading" className="mt-10">
            <h2 id="summary-heading" className="sr-only">
              Order summary
            </h2>

            <div>
              <dl className="space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-base font-medium text-gray-900">Subtotal</dt>
                  <dd className="ml-4 text-base font-medium text-gray-900">${subTotal.toFixed(2)}</dd>
                </div>
              </dl>
              <p className="mt-1 text-sm text-gray-500">
                Shipping and taxes will be calculated at checkout.
              </p>
            </div>

            <div className="mt-10">
              <button
                type="button"
                onClick={syncCartAndRedirect}
                className="w-full rounded-md bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none"
              >
                Checkout
              </button>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
}

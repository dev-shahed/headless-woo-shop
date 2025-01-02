import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

// Create Context
const ProductContext = createContext();

// Create a Provider component
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    axios
      .get("http://localhost:10003/wp-json/wc/v3/products", {
        params: {
          consumer_key: "ck_cdef8d712f469e40121084ddcd750b78c8b25477",
          consumer_secret: "cs_677a0b2deaa1a22bd964e0cf51d5813ef4b94848",
        },
      })
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching products");
        setLoading(false);
      });
  }, []);


  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex((item) => item.id === product.id);

      if (existingProductIndex >= 0) {
        const updatedCart = prevCart.map((item, index) => {
          if (index === existingProductIndex) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });
        return updatedCart;
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };


  return (
    <ProductContext.Provider
      value={{ products, loading, error, cart, addToCart, getCartCount }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook to use the ProductContext
export const useProducts = () => useContext(ProductContext);

ProductProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

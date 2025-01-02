import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import Navbar from './components/Navbar';
import { ProductProvider } from './ProductContext';
import CartItem from './components/CartItem';

function App() {
  return (
    <ProductProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/product/:productId" element={<ProductDetails />} />
        <Route path="/cart" element={<CartItem/>} />
      </Routes>
    </Router>
    </ProductProvider>

  );
}

export default App;

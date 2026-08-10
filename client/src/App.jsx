import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import './pages/pages.css'
import Navbar from './components/Navbar/Navbar.jsx'
import Footer from './components/Footer/Footer.jsx'
import BackToTop from './components/BackToTop/BackToTop.jsx'
import Toast from './components/Toast/Toast.jsx'
import TrolleyDrawer from './components/TrolleyDrawer/TrolleyDrawer.jsx'
import BarcodeScannerModal from './components/BarcodeScanner/BarcodeScannerModal.jsx'
import { useCart } from './context/CartContext.jsx'
import Home from './pages/Home.jsx'
import IceCreams from './pages/IceCreams.jsx'
import Cakes from './pages/Cakes.jsx'
import Chocolates from './pages/Chocolates.jsx'
import ColdBrews from './pages/ColdBrews.jsx'
import About from './pages/About.jsx'
import Wishlist from './pages/Wishlist.jsx'
import Cart from './pages/Cart.jsx'
import Bill from './pages/Bill.jsx'
import NotFound from './pages/NotFound.jsx'
import Orders from './pages/Orders.jsx'

function ScrollToTopOnNavigate() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

export default function App() {
  const { toastMessage, toastVisible } = useCart()

  return (
    <>
      <ScrollToTopOnNavigate />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ice-creams" element={<IceCreams />} />
          <Route path="/ice-cream-cakes" element={<Cakes />} />
          <Route path="/chocolates" element={<Chocolates />} />
          <Route path="/cold-brews" element={<ColdBrews />} />
          <Route path="/about" element={<About />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/bill" element={<Bill />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <TrolleyDrawer />
      <BarcodeScannerModal />
      <Footer />
      <BackToTop />
      <Toast message={toastMessage} visible={toastVisible} />
    </>
  )
}


import { Link } from 'react-router-dom'
import { FiInstagram, FiFacebook, FiTwitter, FiMapPin, FiClock, FiCreditCard } from 'react-icons/fi'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="navbar-logo">
            <span className="navbar-logo-mark">L</span>
            <span className="navbar-logo-text footer-logo-text">
              Lulu Mart Bangalore
              <small>Ice Cream Counter · In-Store</small>
            </span>
          </div>
          <p>Browse the ice cream counter, add to your cart, and pay your bill at checkout — for in-mart shopping only.</p>
          <div className="footer-social">
            <a href="#" aria-label="Instagram"><FiInstagram /></a>
            <a href="#" aria-label="Facebook"><FiFacebook /></a>
            <a href="#" aria-label="Twitter"><FiTwitter /></a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Menu</h4>
          <Link to="/ice-creams">Ice Creams</Link>
          <Link to="/ice-cream-cakes">Ice Cream Cakes</Link>
          <Link to="/chocolates">Chocolates</Link>
          <Link to="/cold-brews">Cold Brews</Link>
          <Link to="/about">About This Counter</Link>
          <Link to="/wishlist">Wishlist</Link>
        </div>

        <div className="footer-col">
          <h4>Shopping</h4>
          <Link to="/cart">View Cart</Link>
          <Link to="/bill">Pay Bill</Link>
        </div>

        <div className="footer-col">
          <h4>Store Info</h4>
          <p className="footer-contact"><FiMapPin /> Lulu Mart, Bangalore</p>
          <p className="footer-contact"><FiClock /> Daily, 10 AM – 10 PM</p>
          <p className="footer-contact"><FiCreditCard /> Pay by cash, card or UPI at billing</p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>&copy; {new Date().getFullYear()} Lulu Mart Bangalore — unofficial in-store demo. Ice cream product names &amp; images belong to Ibaco. Prices are estimates.</p>
        </div>
      </div>
    </footer>
  )
}

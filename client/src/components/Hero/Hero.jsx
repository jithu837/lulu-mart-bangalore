import { Link } from 'react-router-dom'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-copy">
          <span className="badge badge-gold hero-badge">Lulu Mart Bangalore</span>
          <h1 className="hero-title">The Ice Cream Counter</h1>
          <p className="hero-subtitle">
            Browse Ibaco's signature ice cream flavours and celebration cakes,
            add them to your cart, and pay your bill at checkout — all for
            in-mart shopping.
          </p>
          <div className="hero-actions">
            <Link to="/ice-creams" className="btn btn-primary">View Ice Creams</Link>
            <Link to="/cart" className="btn btn-outline hero-outline">View Cart</Link>
          </div>
        </div>
        <div className="hero-media">
          <img
            src="https://www.ibaco.in/assets/img/sundaes/Image-16.png"
            alt="Alphonso Mango ice cream"
          />
        </div>
      </div>
      <div className="stripe-divider" />
    </section>
  )
}

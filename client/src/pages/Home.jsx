import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero/Hero.jsx'
import Categories from '../components/Categories/Categories.jsx'
import ProductCard from '../components/ProductCard/ProductCard.jsx'
import { api } from '../api.js'

export default function Home() {
  const [featuredIceCreams, setFeaturedIceCreams] = useState([])
  const [featuredCakes, setFeaturedCakes] = useState([])
  const [featuredChocolates, setFeaturedChocolates] = useState([])

  useEffect(() => {
    api.getProducts({ category: 'Ice Cream' }).then((data) => setFeaturedIceCreams(data.slice(0, 8))).catch(() => {})
    api.getProducts({ category: 'Ice Cream Cake' }).then((data) => setFeaturedCakes(data.slice(0, 4))).catch(() => {})
    api.getProducts({ category: 'Chocolate' }).then((data) => setFeaturedChocolates(data.slice(0, 4))).catch(() => {})
  }, [])

  return (
    <>
      <Hero />
      <Categories />

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="section-eyebrow">A Taste of the Menu</span>
            <h2>Featured Ice Creams</h2>
            <div className="brass-rule" />
          </div>
          <div className="grid grid-4">
            {featuredIceCreams.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
          <div className="popular-more">
            <Link to="/ice-creams" className="btn btn-outline popular-more-btn">View All Flavours</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--parchment)' }}>
        <div className="container">
          <div className="section-heading">
            <span className="section-eyebrow">For Every Celebration</span>
            <h2>Featured Ice Cream Cakes</h2>
            <div className="brass-rule" />
          </div>
          <div className="grid grid-4">
            {featuredCakes.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
          <div className="popular-more">
            <Link to="/ice-cream-cakes" className="btn btn-outline popular-more-btn">View All Cakes</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="section-eyebrow">Perfect for Gifting</span>
            <h2>Featured Chocolates</h2>
            <div className="brass-rule" />
          </div>
          <div className="grid grid-4">
            {featuredChocolates.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
          <div className="popular-more">
            <Link to="/chocolates" className="btn btn-outline popular-more-btn">View All Chocolates</Link>
          </div>
        </div>
      </section>

      <section className="section about-blurb">
        <div className="container about-blurb-inner">
          <span className="section-eyebrow">About Ibaco</span>
          <h2>A Hatsun Agro Ice Cream Parlour</h2>
          <p>
            Ibaco is an Indian ice cream and cake parlour chain from Hatsun
            Agro Product Ltd, launched in 2011 and known for its wide range
            of scoop flavours and celebration cakes across South India.
          </p>
          <Link to="/about" className="btn btn-primary">Read More</Link>
        </div>
      </section>
    </>
  )
}

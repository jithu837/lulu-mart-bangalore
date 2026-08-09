import { Link } from 'react-router-dom'
import './Categories.css'

const CATEGORIES = [
  {
    id: 'ice-creams',
    name: 'Ice Creams',
    desc: '29 signature flavours, from classic vanilla to jackfruit and fig & honey.',
    image: 'https://www.ibaco.in/assets/img/sundaes/Image-16.png',
    to: '/ice-creams',
  },
  {
    id: 'ice-cream-cakes',
    name: 'Ice Cream Cakes',
    desc: '12 celebration cakes serving 6 to 20, built layer by layer with real ice cream.',
    image: 'https://www.ibaco.in/assets/img/cakes/cake8.png',
    to: '/ice-cream-cakes',
  },
  {
    id: 'chocolates',
    name: 'Chocolates',
    desc: '26 gifting chocolates, from ganache and marzipan to bar chocolates.',
    image: 'https://www.ibaco.in/assets/img/chocolates/9C.png',
    to: '/chocolates',
  },
  {
    id: 'cold-brews',
    name: 'Cold Brews',
    desc: 'Coffee, mocha and matcha cold brews to go with your order.',
    image: 'https://www.ibaco.in/assets/img/coldbrew/coldbrew-mocha-new.png',
    to: '/cold-brews',
  },
]

export default function Categories() {
  return (
    <section className="section categories-section">
      <div className="container">
        <div className="section-heading">
          <span className="section-eyebrow">Browse the Counter</span>
          <h2>Shop by Category</h2>
          <div className="brass-rule" />
        </div>

        <div className="categories-grid">
          {CATEGORIES.map((cat) => (
            <Link to={cat.to} className="category-card" key={cat.id}>
              <img src={cat.image} alt={cat.name} loading="lazy" />
              <div className="category-card-body">
                <h3>{cat.name}</h3>
                <p>{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

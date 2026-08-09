export default function About() {
  return (
    <div className="page-shell">
      <div className="container">
        <div className="page-header">
          <span className="section-eyebrow">Our Story</span>
          <h1>About This Counter</h1>
          <p>The Ibaco ice cream counter inside Lulu Mart Bangalore — an in-store shopping demo.</p>
        </div>

        <div className="about-story">
          <img
            src="https://www.ibaco.in/assets/img/cakes/cake9.png"
            alt="Ibaco Mango Kingdom Gala ice cream cake"
          />
          <div>
            <span className="section-eyebrow">Who Makes These Ice Creams</span>
            <h2>Ibaco, a Hatsun Agro Brand</h2>
            <p>
              The ice creams and cakes stocked at this counter are made by
              Ibaco, launched in 2011 by R. G. Chandramogan, founder of
              Hatsun Agro Product Ltd, one of India's largest dairy companies.
            </p>
            <p>
              This page is a demo built for in-mart browsing at Lulu Mart
              Bangalore — add items to your cart and pay your bill at the
              counter, no online ordering or delivery involved. Product
              names, descriptions and images are adapted from Ibaco's own
              website; this is an unofficial showcase, not the official
              Ibaco or Lulu Mart site.
            </p>
          </div>
        </div>

        <div className="about-values">
          <div className="value-card">
            <div className="value-icon">🍨</div>
            <h3>29 Signature Flavours</h3>
            <p>From Bean Vanilla to Nuts & Saffron, rotated with seasonal specials.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">🎂</div>
            <h3>12 Celebration Cakes</h3>
            <p>Ice cream cakes built for gatherings of 6 up to 20 guests.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">🧾</div>
            <h3>Pay at Billing</h3>
            <p>Prices shown are typical mart estimates. Add to cart, then pay your bill in-store.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

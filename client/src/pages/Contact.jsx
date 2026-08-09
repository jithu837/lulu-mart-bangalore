import { useState } from 'react'

export default function Contact() {
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <div className="page-shell">
      <div className="container">
        <div className="page-header">
          <span className="section-eyebrow">We'd Love to Hear From You</span>
          <h1>Contact Us</h1>
          <p>Questions about an order, a store visit, or a bulk booking? Write to us.</p>
        </div>

        <form className="contact-form" onSubmit={submit}>
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <input type="text" placeholder="Subject" required />
          <textarea placeholder="Your Message" required />
          <button className="btn btn-primary" type="submit">
            {sent ? 'Message Sent ✓' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  )
}

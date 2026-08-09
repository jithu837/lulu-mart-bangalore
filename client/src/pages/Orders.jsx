import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import './Orders.css'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    api.getOrders()
      .then((data) => setOrders(data))
      .catch((err) => setError(err.message || 'Could not load orders.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page-shell">
      <div className="container">
        <div className="page-header">
          <span className="section-eyebrow">Bill Folder</span>
          <h1>Recent Bills</h1>
          <p>This page shows recent bills recorded in the database collection, including pending and paid orders.</p>
        </div>

        {loading && <div className="empty-state card"><p>Loading orders...</p></div>}
        {error && <div className="empty-state card"><p>{error}</p></div>}

        {!loading && !error && orders.length === 0 && (
          <div className="empty-state card">
            <p>No orders have been recorded yet.</p>
            <Link to="/ice-creams" className="btn btn-primary">Add items to start billing</Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="orders-table-wrap">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Status</th>
                  <th>Method</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="order-id">{order._id}</td>
                    <td>{order.status}</td>
                    <td>{order.paymentMethod || 'pending'}</td>
                    <td>{order.items.length}</td>
                    <td>₹{order.grandTotal}</td>
                    <td>{new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

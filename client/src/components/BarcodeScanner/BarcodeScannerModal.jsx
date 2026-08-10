import { useState, useEffect, useRef } from 'react'
import { FiX, FiCamera, FiCheckCircle, FiSearch, FiShoppingBag, FiArrowRight } from 'react-icons/fi'
import { useCart } from '../../context/CartContext.jsx'
import { api } from '../../api.js'
import './BarcodeScannerModal.css'

// Preset popular Lulu Mart barcodes for instant scan testing
const SAMPLE_BARCODES = [
  { barcode: 'LULU-IC-01', name: 'Belgian Chocolate Scoop', category: 'Ice Cream', price: 119, image: 'https://www.ibaco.in/assets/img/sundaes/Image-19.png' },
  { barcode: 'LULU-IC-02', name: 'Alphonso Mango Scoop', category: 'Ice Cream', price: 99, image: 'https://www.ibaco.in/assets/img/sundaes/Image-16.png' },
  { barcode: 'LULU-CK-01', name: 'Choco Cookie Teddy Bear Cake', category: 'Ice Cream Cake', price: 999, image: 'https://www.ibaco.in/assets/img/cakes/Bear-Cake.png' },
  { barcode: 'LULU-CH-01', name: 'Dark Chocolate Fantasy', category: 'Chocolates', price: 89, image: 'https://www.ibaco.in/assets/img/chocolates/7A.png' },
  { barcode: 'LULU-CB-01', name: 'Mocha Cold Brew', category: 'Cold Brew', price: 149, image: 'https://www.ibaco.in/assets/img/coldbrew/coldbrew-mocha-new.png' },
]

export default function BarcodeScannerModal() {
  const { isScannerOpen, closeScanner, addToCart, openTrolley } = useCart()
  const [barcodeInput, setBarcodeInput] = useState('')
  const [scannedItem, setScannedItem] = useState(null)
  const [scanCount, setScanCount] = useState(0)
  const [beep, setBeep] = useState(false)
  const [dbProducts, setDbProducts] = useState([])
  const inputRef = useRef(null)

  useEffect(() => {
    if (isScannerOpen) {
      api.getProducts().then((data) => setDbProducts(data)).catch(() => {})
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [isScannerOpen])

  if (!isScannerOpen) return null

  const handleScanProduct = (product) => {
    // Play visual beep
    setBeep(true)
    setTimeout(() => setBeep(false), 500)

    addToCart(product, 1, true)
    setScannedItem(product)
    setScanCount((prev) => prev + 1)
    setBarcodeInput('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const clean = barcodeInput.trim().toUpperCase()
    if (!clean) return

    // 1. Try finding in sample barcodes
    let match = SAMPLE_BARCODES.find((b) => b.barcode === clean || b.name.toUpperCase().includes(clean))

    // 2. Try finding in backend fetched products
    if (!match && dbProducts.length > 0) {
      match = dbProducts.find((p) =>
        p._id.toUpperCase().includes(clean) ||
        p.name.toUpperCase().includes(clean)
      )
    }

    if (match) {
      handleScanProduct(match)
    } else {
      // Fallback pseudo product if arbitrary barcode is typed
      const fallbackProduct = {
        _id: `BARCODE-${clean}`,
        name: `Scanned Item #${clean}`,
        category: 'In-Store Item',
        price: 99,
        image: 'https://www.ibaco.in/assets/img/sundaes/Image-19.png',
      }
      handleScanProduct(fallbackProduct)
    }
  }

  return (
    <div className="scanner-overlay" onClick={closeScanner}>
      <div className="scanner-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="scanner-header">
          <div className="scanner-header-title">
            <FiCamera className="scanner-icon" />
            <div>
              <h3>Lulu Mart Scan-&-Go</h3>
              <p>Self-Checkout Barcode Reader · Counter Scanner</p>
            </div>
          </div>
          <button className="scanner-close" onClick={closeScanner} aria-label="Close Scanner">
            <FiX size={20} />
          </button>
        </div>

        {/* Scanner Viewfinder Box */}
        <div className={`viewfinder-box ${beep ? 'beep-flash' : ''}`}>
          <div className="viewfinder-corner top-left" />
          <div className="viewfinder-corner top-right" />
          <div className="viewfinder-corner bottom-left" />
          <div className="viewfinder-corner bottom-right" />

          <div className="laser-line" />

          {beep && (
            <div className="beep-indicator">
              <span>BEEP! 🛎️</span>
              <small>Item Added to Trolley</small>
            </div>
          )}

          {!beep && !scannedItem && (
            <div className="viewfinder-instructions">
              <span className="scanner-aim-icon">🎯</span>
              <p>Position item barcode under laser</p>
              <small>Click sample barcodes below or type code</small>
            </div>
          )}

          {scannedItem && !beep && (
            <div className="scanned-result-card">
              <FiCheckCircle className="scanned-success-icon" />
              <img src={scannedItem.image} alt={scannedItem.name} className="scanned-thumb" />
              <div className="scanned-details">
                <span className="scanned-category">{scannedItem.category}</span>
                <h4 className="scanned-title">{scannedItem.name}</h4>
                <strong className="scanned-price">₹{scannedItem.price}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Input barcode manual form */}
        <form onSubmit={handleSubmit} className="manual-barcode-form">
          <div className="barcode-input-group">
            <FiSearch className="search-icon" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Enter or paste barcode (e.g. LULU-IC-01)..."
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
            />
            <button type="submit" className="btn btn-gold btn-sm">Scan</button>
          </div>
        </form>

        {/* Quick Sample Barcodes shelf */}
        <div className="sample-barcodes-shelf">
          <span>Tap Barcode to Scan:</span>
          <div className="sample-chips">
            {SAMPLE_BARCODES.map((item) => (
              <button
                key={item.barcode}
                className="sample-chip"
                onClick={() => handleScanProduct(item)}
              >
                <span className="chip-code">║▌│█ {item.barcode}</span>
                <span className="chip-name">{item.name}</span>
                <span className="chip-price">₹{item.price}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer info & action */}
        <div className="scanner-footer">
          <span className="scanned-total-badge">
            <FiShoppingBag /> Scanned this session: <strong>{scanCount} items</strong>
          </span>
          <div className="scanner-footer-btns">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                closeScanner()
                openTrolley()
              }}
            >
              Open Trolley 🛒
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

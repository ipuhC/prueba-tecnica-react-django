import { useState } from 'react'
import { useCartStore } from '../store/cartStore'
import { Link } from 'react-router-dom'
import { useApi } from '../hooks/useApi'

export function Cart() {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } =
    useCartStore()
  const { saveCart } = useApi()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderSuccess, setOrderSuccess] = useState<{
    orderNumber: string
    products: { name: string; quantity: number; price: string }[]
  } | null>(null)

  const handleCheckout = async () => {
    if (items.length === 0) return
    setLoading(true)
    setError(null)
    setOrderSuccess(null)
    try {
      const body = items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }))
      const data = await saveCart(body)
      setOrderSuccess({
        orderNumber: data.order_number,
        products: data.products,
      })
      clearCart()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  if (orderSuccess) {
    return (
      <section className="cart-section">
        <h2 className="section-title">Carrito guardado</h2>
        <div className="order-success">
          <p className="order-number">
            Número de orden: <strong>{orderSuccess.orderNumber}</strong>
          </p>
          <h4>Productos en el carrito:</h4>
          <ul className="order-products-list">
            {orderSuccess.products.map((p, i) => (
              <li key={i}>
                {p.name} x{p.quantity} - ${parseFloat(p.price).toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      </section>
    )
  }

  if (items.length === 0 && !loading) {
    return (
      <section className="cart-section">
        <h2 className="section-title">Carrito</h2>
        <div className="empty-cart">
          <div className="empty-cart-content">
            <p>Tu carrito está vacío, puedes revisar los carritos guardados en la sección de </p>
            <Link to="/carts" className="btn btn-primary"> carritos guardados</Link>
          </div>
        </div>
      </section>
    )
  }

  const total = getTotalPrice()

  return (
    <section className="cart-section">
      <h2 className="section-title">Carrito de compras</h2>
      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}
      <div className="cart-items">
        {items.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-info">
              <h4 className="cart-item-name">{item.name}</h4>
              <p className="cart-item-price">
                ${parseFloat(item.price).toFixed(2)} c/u
              </p>
            </div>
            <div className="cart-item-actions">
              <div className="quantity-controls">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="qty-btn"
                  aria-label="Reducir cantidad"
                >
                  −
                </button>
                <span className="qty-value">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="qty-btn"
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="remove-item-btn"
              >
                Eliminar
              </button>
            </div>
            <div className="cart-item-subtotal">
              ${(parseFloat(item.price) * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      <div className="cart-footer">
        <p className="cart-total">
          Total: <strong>${total.toFixed(2)}</strong>
        </p>
        <button
          type="button"
          onClick={handleCheckout}
          disabled={loading}
          className="checkout-button"
        >
          {loading ? 'Guardando...' : 'Guardar carrito'}
        </button>
      </div>
    </section>
  )
}

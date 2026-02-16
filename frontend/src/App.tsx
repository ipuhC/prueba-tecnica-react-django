import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import { Home } from './views/Home'
import { Cart } from './views/Cart'
import { SavedCarts } from './views/SavedCarts'
import { useCartStore } from './store/cartStore'

function App() {
  const totalItems = useCartStore((s) =>
    s.items.reduce((acc, i) => acc + i.quantity, 0)
  )
  return (
    <BrowserRouter>
      <div className="app">
        <header className="header">
          <div className="container">
            <h1 className="logo">E-Commerce</h1>
            <nav className="nav">
              <Link to="/" className="nav-link">Inicio</Link>
              <Link to="/cart" className="nav-link">
                Carrito {totalItems > 0 && `(${totalItems})`}
              </Link>
              <Link to="/carts" className="nav-link">Carritos guardados</Link>
            </nav>
          </div>
        </header>

        <main className="main">
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/carts" element={<SavedCarts />} />
            </Routes>
          </div>
        </main>

        <footer className="footer">
          <div className="container">
            <p>&copy; 2026 E-Commerce. Todos los derechos reservados.</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App

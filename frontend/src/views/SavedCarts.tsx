import { useState, useEffect, useCallback } from 'react'
import { useApi } from '../hooks/useApi'
import type { SavedCart, CartsFilters } from '../hooks/useApi'

function formatDate(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export function SavedCarts() {
  const { fetchCarts: apiFetchCarts, deleteCart } = useApi()
  const [carts, setCarts] = useState<SavedCart[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cartToDelete, setCartToDelete] = useState<SavedCart | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [filters, setFilters] = useState<CartsFilters>({
    minPrice: '',
    maxPrice: '',
    dateFrom: '',
    dateTo: '',
  })
  const [page, setPage] = useState(1)
  const [filterKey, setFilterKey] = useState(0)
  const [pagination, setPagination] = useState({
    count: 0,
    total_pages: 1,
    page: 1,
  })

  const fetchCarts = useCallback(async (filtersArg: CartsFilters, pageArg: number) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiFetchCarts(filtersArg, pageArg)
      setCarts(data.results)
      setPagination({
        count: data.count,
        total_pages: data.total_pages,
        page: data.page,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [apiFetchCarts])

  useEffect(() => {
    fetchCarts(filters, page)
  }, [page, filterKey])

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    setFilterKey((k) => k + 1)
  }

  const handleClearFilters = () => {
    setFilters({ minPrice: '', maxPrice: '', dateFrom: '', dateTo: '' })
    setPage(1)
    setFilterKey((k) => k + 1)
  }

  const handleDeleteCart = async (cart: SavedCart) => {
    if (!cartToDelete || cartToDelete.id !== cart.id) return
    setDeleting(true)
    try {
      await deleteCart(cart.id)
      setCartToDelete(null)
      const remaining = carts.filter((c) => c.id !== cart.id)
      if (remaining.length > 0) {
        setCarts(remaining)
      } else {
        const nextPage = Math.max(1, page - 1)
        setPage(nextPage)
        fetchCarts(filters, nextPage)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar')
    } finally {
      setDeleting(false)
    }
  }

  if (error && carts.length === 0) {
    return (
      <section className="cart-section">
        <h2 className="section-title">Carritos guardados</h2>
        <div className="carts-filters-wrap">
          <form className="carts-filters" onSubmit={handleApplyFilters}>
            <label className="filter-label">
              Precio mín.
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0"
                value={filters.minPrice}
                onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value }))}
                className="filter-input"
              />
            </label>
            <label className="filter-label">
              Precio máx.
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="—"
                value={filters.maxPrice}
                onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))}
                className="filter-input"
              />
            </label>
            <label className="filter-label">
              Fecha desde
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
                className="filter-input"
              />
            </label>
            <label className="filter-label">
              Fecha hasta
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))}
                className="filter-input"
              />
            </label>
<button type="submit" className="filter-submit-btn">Filtrar</button>
            <button type="button" className="filter-clear-btn" onClick={handleClearFilters}>
              Limpiar filtros
            </button>
        </form>
      </div>
        <div className="error">
          <p>{error}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="cart-section">
      <h2 className="section-title">Carritos guardados</h2>
      <div className="carts-filters-wrap">
        <form className="carts-filters" onSubmit={handleApplyFilters}>
          <label className="filter-label">
            Precio mín.
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0"
              value={filters.minPrice}
              onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value }))}
              className="filter-input"
            />
          </label>
          <label className="filter-label">
            Precio máx.
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="—"
              value={filters.maxPrice}
              onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))}
              className="filter-input"
            />
          </label>
          <label className="filter-label">
            Fecha desde
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
              className="filter-input"
            />
          </label>
          <label className="filter-label">
            Fecha hasta
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))}
              className="filter-input"
            />
          </label>
          <button type="submit" className="filter-submit-btn">Filtrar</button>
            <button type="button" className="filter-clear-btn" onClick={handleClearFilters}>
              Limpiar filtros
            </button>
        </form>
      </div>

      {error && carts.length > 0 && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="loading">
          <div className="spinner" />
          <p>Cargando carritos...</p>
        </div>
      ) : carts.length === 0 ? (
        <div className="empty-cart">
          <p>No hay carritos con estos filtros.</p>
          <p className="empty-state">Prueba otros filtros o guarda un carrito desde la página del carrito.</p>
        </div>
      ) : (
        <>
      <div className="saved-carts-list">
        {carts.map((cart) => (
          <div key={cart.id} className="saved-cart-card">
            <div className="saved-cart-header">
              <span className="saved-cart-id">Carrito #{cart.id}</span>
              <span className="saved-cart-date">{formatDate(cart.created_at)}</span>
            </div>
            <h4 className="saved-cart-products-title">Productos:</h4>
            <ul className="order-products-list">
              {cart.products.map((p, i) => (
                <li key={i}>
                  {p.name} x{p.quantity} - ${parseFloat(p.price).toFixed(2)}
                </li>
              ))}
            </ul>
            <p className="saved-cart-total">
              Total: <strong>${parseFloat(cart.total_price).toFixed(2)}</strong>
            </p>
            <button
              type="button"
              className="saved-cart-delete-btn"
              onClick={() => setCartToDelete(cart)}
              aria-label="Eliminar carrito"
            >
              Eliminar carrito
            </button>
          </div>
        ))}
      </div>

      <div className="carts-pagination">
        <button
          type="button"
          className="pagination-btn"
          disabled={pagination.page <= 1 || loading}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Anterior
        </button>
        <span className="pagination-info">
          Página {pagination.page} de {pagination.total_pages} ({pagination.count} carritos)
        </span>
        <button
          type="button"
          className="pagination-btn"
          disabled={pagination.page >= pagination.total_pages || loading}
          onClick={() => setPage((p) => Math.min(pagination.total_pages, p + 1))}
        >
          Siguiente
        </button>
      </div>
        </>
      )}

      {cartToDelete && (
        <div className="modal-overlay" onClick={() => !deleting && setCartToDelete(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">¿Eliminar carrito?</h3>
            <p className="modal-body">
              Se eliminará el carrito #{cartToDelete.id} del {formatDate(cartToDelete.created_at)}.
              Esta acción no se puede deshacer.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="modal-btn modal-btn-cancel"
                onClick={() => setCartToDelete(null)}
                disabled={deleting}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="modal-btn modal-btn-confirm"
                onClick={() => handleDeleteCart(cartToDelete)}
                disabled={deleting}
              >
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

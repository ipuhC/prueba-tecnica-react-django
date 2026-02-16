import { useState, useEffect, useCallback } from 'react'
import { useCartStore } from '../store/cartStore'
import { useApi } from '../hooks/useApi'
import type { Product, ProductFilters } from '../hooks/useApi'

export type { Product }

export function Home() {
  const { fetchProducts: apiFetchProducts } = useApi()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ProductFilters>({
    name: '',
    minPrice: '',
    maxPrice: '',
  })
  const [page, setPage] = useState(1)
  const [filterKey, setFilterKey] = useState(0)
  const [pagination, setPagination] = useState({
    count: 0,
    total_pages: 1,
    page: 1,
  })
  const addItem = useCartStore((s) => s.addItem)

  const fetchProducts = useCallback(async (filtersArg: ProductFilters, pageArg: number) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiFetchProducts(filtersArg, pageArg)
      setProducts(data.results)
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
  }, [apiFetchProducts])

  useEffect(() => {
    fetchProducts(filters, page)
  }, [page, filterKey])

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    setFilterKey((k) => k + 1)
  }

  const handleClearFilters = () => {
    setFilters({ name: '', minPrice: '', maxPrice: '' })
    setPage(1)
    setFilterKey((k) => k + 1)
  }

  return (
    <>
      <section className="hero">
        <h2 className="hero-title">Prueba tecnica ecommerce</h2>
      </section>

      <section className="products-section">
        <h3 className="section-title">Productos</h3>

        <div className="carts-filters-wrap">
          <form className="carts-filters" onSubmit={handleApplyFilters}>
            <label className="filter-label">
              Nombre
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={filters.name}
                onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))}
                className="filter-input"
              />
            </label>
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
            <button type="submit" className="filter-submit-btn">Filtrar</button>
            <button type="button" className="filter-clear-btn" onClick={handleClearFilters}>
              Limpiar filtros
            </button>
          </form>
        </div>

        {error && (
          <div className="error">
            <p>Error al cargar los productos: {error}</p>
            <button onClick={() => fetchProducts(filters, page)} className="retry-button">
              Reintentar
            </button>
          </div>
        )}

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Cargando productos...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <p>No hay productos con estos filtros.</p>
          </div>
        ) : (
          <>
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <div className="product-placeholder">
                  <img src="margarina-mavesa-500g.jpg" alt="margarina mavesa 500g" />
                </div>
              </div>
              <div className="product-info">
                <h4 className="product-name">{product.name}</h4>
                <p className="product-description">{product.description || 'Sin descripción'}</p>
                <div className="product-footer">
                  <span className="product-price">${parseFloat(product.price).toFixed(2)}</span>
                  <span className={`product-stock ${product.stock === 0 ? 'out-of-stock' : ''}`}>
                    {product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
                  </span>
                </div>
                <button
                  className="add-to-cart-button"
                  disabled={product.stock === 0}
                  onClick={() =>
                    addItem({
                      id: product.id,
                      name: product.name,
                      description: product.description,
                      price: product.price,
                    })
                  }
                >
                  {product.stock > 0 ? 'Agregar al carrito' : 'No disponible'}
                </button>
              </div>
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
            Página {pagination.page} de {pagination.total_pages} ({pagination.count} productos)
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
      </section>
    </>
  )
}

const API_BASE = import.meta.env.VITE_API_BASE

// --- Tipos usados por la API ---

export type ProductFilters = { name: string; minPrice: string; maxPrice: string }
export type CartsFilters = {
  minPrice: string
  maxPrice: string
  dateFrom: string
  dateTo: string
}

export interface Product {
  id: number
  name: string
  description: string
  price: string
  stock: number
}

export type CartProduct = { id?: number; name: string; quantity: number; price: string }
export interface SavedCart {
  id: number
  products: CartProduct[]
  total_price: string
  created_at: string
}

export interface ProductsResponse {
  results: Product[]
  count: number
  total_pages: number
  page: number
}

export interface CartsResponse {
  results: SavedCart[]
  count: number
  total_pages: number
  page: number
}

export interface SaveCartItem {
  id: number
  name: string
  price: string
  quantity: number
}

export interface SaveCartResponse {
  order_number: string
  products: { name: string; quantity: number; price: string }[]
}

// --- Helpers internos para construir URLs ---

function buildProductsUrl(filters: ProductFilters, page: number): string {
  const params = new URLSearchParams()
  if (filters.name.trim()) params.set('name', filters.name.trim())
  if (filters.minPrice.trim()) params.set('min_price', filters.minPrice.trim())
  if (filters.maxPrice.trim()) params.set('max_price', filters.maxPrice.trim())
  params.set('page', String(page))
  return `${API_BASE}/products/?${params.toString()}`
}

function buildCartsUrl(filters: CartsFilters, page: number): string {
  const params = new URLSearchParams()
  if (filters.minPrice.trim()) params.set('min_price', filters.minPrice.trim())
  if (filters.maxPrice.trim()) params.set('max_price', filters.maxPrice.trim())
  if (filters.dateFrom.trim()) params.set('date_from', filters.dateFrom.trim())
  if (filters.dateTo.trim()) params.set('date_to', filters.dateTo.trim())
  params.set('page', String(page))
  return `${API_BASE}/carts/?${params.toString()}`
}

// --- Hook ---

export function useApi() {
  const fetchProducts = async (
    filters: ProductFilters,
    page: number
  ): Promise<ProductsResponse> => {
    const url = buildProductsUrl(filters, page)
    const response = await fetch(url)
    if (!response.ok) throw new Error('Error al cargar los productos')
    return response.json()
  }

  const saveCart = async (
    items: SaveCartItem[]
  ): Promise<SaveCartResponse> => {
    const response = await fetch(`${API_BASE}/save-cart/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.detail || data.error || 'Error al guardar el carrito')
    }
    return data
  }

  const fetchCarts = async (
    filters: CartsFilters,
    page: number
  ): Promise<CartsResponse> => {
    const url = buildCartsUrl(filters, page)
    const response = await fetch(url)
    if (!response.ok) throw new Error('Error al cargar los carritos')
    return response.json()
  }

  const deleteCart = async (cartId: number): Promise<void> => {
    const response = await fetch(`${API_BASE}/carts/${cartId}/`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Error al eliminar el carrito')
  }

  return {
    apiBase: API_BASE,
    fetchProducts,
    saveCart,
    fetchCarts,
    deleteCart,
  }
}

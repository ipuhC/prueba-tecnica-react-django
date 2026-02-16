# E-Commerce - Prueba Técnica

Aplicación de ecommerce simple con Django REST Framework y React + TypeScript.

##  Características

- **Backend**: Django REST Framework con API REST
- **Frontend**: React + TypeScript + Vite + React Router + Zustand
- **Base de datos**: SQLite (desarrollo)
- **Estilos**: CSS moderno y responsivo
- **Carrito de compras** en memoria con persistencia local
- **Guardar carritos** en el backend y listar/eliminar carritos guardados
- **Productos** con búsqueda por nombre, filtros por precio y paginación
- **Carritos guardados** con filtros por precio y rango de fechas

## Requisitos

- Docker y Docker Compose
- (Opcional) Node.js 18+ y Python 3.11+ para desarrollo local

## Instalación y Ejecución

### Con Docker Compose (Recomendado)

1. Clona el repositorio y navega al directorio:
```bash
cd prueba-tecnica
```

2. Inicia los servicios:
```bash
docker-compose up --build
```

3. Accede a las aplicaciones:
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:8000
   - **Admin Django**: http://localhost:8000/admin

### Crear superusuario (para acceder al admin de Django)

```bash
docker-compose exec backend python manage.py createsuperuser
```

### Agregar productos de prueba

#### Opción 1: Usando el Seeder (Recomendado)

El proyecto incluye un comando personalizado para crear 20 productos de prueba automáticamente:

```bash
# Crear productos de prueba
docker-compose exec backend python manage.py seed_products

# Si quieres eliminar todos los productos existentes antes de crear nuevos
docker-compose exec backend python manage.py seed_products --clear
```

#### Opción 2: Desde el panel de administración

Accede a http://localhost:8000/admin y crea productos manualmente.

#### Opción 3: Usando el shell de Django

```bash
docker-compose exec backend python manage.py shell
```

Luego ejecuta:
```python
from api.models import Product

Product.objects.create(
    name="Laptop HP",
    description="Laptop de alta gama con 16GB RAM",
    price=999.99,
    stock=10
)
```

## Estructura del Proyecto

```
prueba-tecnica/
├── backend/                    # API Django REST
│   ├── api/                    # App de productos y carritos
│   │   ├── models.py           # Product, Cart
│   │   ├── views.py            # product_list, save_cart, cart_list, cart_detail
│   │   ├── serializers.py      # ProductSerializer, CartSerializer
│   │   ├── urls.py             # Rutas de la API
│   │   └── management/commands/
│   │       └── seed_products.py
│   ├── core/                   # Configuración Django
│   │   ├── settings.py
│   │   └── urls.py             # Incluye api/ y admin/
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/                   # App React + TypeScript
│   ├── src/
│   │   ├── App.tsx             # Router y layout principal
│   │   ├── App.css
│   │   ├── main.tsx
│   │   ├── index.css
│   │   ├── views/              # Páginas
│   │   │   ├── Home.tsx        # Listado de productos (paginado, filtros)
│   │   │   ├── Cart.tsx        # Carrito y guardar carrito
│   │   │   └── SavedCarts.tsx  # Listado de carritos guardados
│   │   ├── store/
│   │   │   └── cartStore.ts    # Estado del carrito (Zustand)
│   │   └── hooks/
│   │       └── useApi.ts       # Cliente HTTP para la API
│   ├── package.json
│   ├── Dockerfile
│   └── .env                    # VITE_API_URL (opcional)
└── docker-compose.yml
```

## API Endpoints

Base URL: `http://localhost:8000/api/`

### Productos

- **GET** `/api/products/` — Lista productos con filtros y paginación.

  **Query params:** `name` (búsqueda por nombre), `min_price`, `max_price`, `page` (por defecto 1). Tamaño de página: 6.

  **Respuesta:**
  ```json
  {
    "count": 20,
    "total_pages": 4,
    "page": 1,
    "next": true,
    "previous": false,
    "results": [
      {
        "id": 1,
        "name": "Producto",
        "description": "Descripción del producto",
        "price": "99.99",
        "stock": 10
      }
    ]
  }
  ```

### Carritos

- **POST** `/api/save-cart/` — Guarda un carrito y devuelve número de orden y resumen.

  **Body:**
  ```json
  {
    "items": [
      { "id": 1, "name": "Laptop", "price": "999.99", "quantity": 2 }
    ]
  }
  ```

  **Respuesta:**
  ```json
  {
    "success": true,
    "order_number": "ORD-A1B2C3D4",
    "cart_id": 1,
    "products": [
      { "id": 1, "name": "Laptop", "quantity": 2, "price": "999.99" }
    ],
    "total_price": "1999.98"
  }
  ```

- **GET** `/api/carts/` — Lista carritos guardados con filtros y paginación.

  **Query params:** `min_price`, `max_price`, `date_from` (YYYY-MM-DD), `date_to` (YYYY-MM-DD), `page` (por defecto 1). Tamaño de página: 3.

  **Respuesta:**
  ```json
  {
    "count": 5,
    "total_pages": 2,
    "page": 1,
    "next": true,
    "previous": false,
    "results": [
      {
        "id": 1,
        "products": [
          { "id": 1, "name": "Laptop", "quantity": 2, "price": "999.99" }
        ],
        "total_price": "1999.98",
        "created_at": "2026-02-16T12:00:00Z"
      }
    ]
  }
  ```

- **GET** `/api/carts/<id>/` — Devuelve el detalle de un carrito.

- **DELETE** `/api/carts/<id>/` — Elimina un carrito guardado. Respuesta: 204 No Content.

## Comandos Personalizados

### Seeder de Productos

Crea 20 productos de prueba en la base de datos:

```bash
# Crear productos de prueba
docker-compose exec backend python manage.py seed_products

# Ver ayuda del comando
docker-compose exec backend python manage.py seed_products --help

# Eliminar productos existentes y crear nuevos
docker-compose exec backend python manage.py seed_products --clear
```

El seeder incluye productos variados como:
- Laptops y computadoras
- Periféricos (mouse, teclado, webcam)
- Monitores y pantallas
- Dispositivos móviles
- Accesorios tecnológicos
- Y mucho más...

## Características del Frontend

- **Inicio**: listado de productos con paginación, búsqueda por nombre y filtros por precio
- **Carrito**: agregar/quitar productos, guardar carrito en el backend y ver número de orden
- **Carritos guardados**: listado paginado con filtros por precio y rango de fechas, ver detalle y eliminar
- Estado del carrito con Zustand y persistencia en `localStorage`
- Estados de carga y error en las vistas
- Navegación con React Router (Inicio, Carrito, Carritos guardados)

## Desarrollo

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Notas

- Esta es una aplicación de prueba para propósitos educativos
- CORS está habilitado para permitir peticiones desde el frontend
- La base de datos SQLite se usa solo para desarrollo

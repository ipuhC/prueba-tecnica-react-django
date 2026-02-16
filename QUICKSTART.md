# Guía de Inicio Rápido

## Pasos para levantar el proyecto

### 1. Iniciar los servicios
```bash
docker-compose up --build
```

### 2. Crear productos de prueba
En otra terminal, ejecuta:
```bash
docker-compose exec backend python manage.py seed_products
```

### 3. (Opcional) Crear superusuario para el admin
```bash
docker-compose exec backend python manage.py createsuperuser
```

### 4. Acceder a la aplicación
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api/products/
- **Django Admin**: http://localhost:8000/admin

## Comandos útiles

### Ver logs
```bash
# Ver todos los logs
docker-compose logs -f

# Ver logs del backend
docker-compose logs -f backend

# Ver logs del frontend
docker-compose logs -f frontend
```

### Reiniciar servicios
```bash
# Reiniciar todos los servicios
docker-compose restart

# Reiniciar solo el backend
docker-compose restart backend
```

### Ejecutar migraciones
```bash
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate
```

### Resetear base de datos
```bash
# Detener servicios
docker-compose down

# Eliminar volúmenes (incluye la base de datos)
docker-compose down -v

# Volver a iniciar
docker-compose up --build

# Crear productos de nuevo
docker-compose exec backend python manage.py seed_products
```

### Acceder al shell de Django
```bash
docker-compose exec backend python manage.py shell
```

### Acceder al contenedor
```bash
# Backend
docker-compose exec backend bash

# Frontend
docker-compose exec frontend sh
```

## Solución de problemas comunes

### El frontend no carga los productos
1. Verifica que el backend esté corriendo: http://localhost:8000/api/products/
2. Revisa los logs del backend: `docker-compose logs backend`
3. Asegúrate de que existan productos en la base de datos

### Error de puertos en uso
Si los puertos 8000 o 5173 ya están en uso:
```bash
# Detener todos los contenedores
docker-compose down

# Verificar procesos en los puertos
lsof -i :8000
lsof -i :5173

# Matar el proceso si es necesario
kill -9 <PID>
```

### Cambios en el código no se reflejan
```bash
# Reconstruir los contenedores
docker-compose up --build
```

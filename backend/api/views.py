import uuid
from decimal import Decimal
from datetime import datetime
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from .models import Product, Cart
from .serializers import ProductSerializer, CartSerializer
from rest_framework.decorators import api_view

PAGE_SIZE = 3
PAGE_SIZE_PRODUCTS = 6


@api_view(['GET'])
def product_list(request):
    """
    Lista productos con filtros y paginación.
    Query params: name (búsqueda por nombre), min_price, max_price, page (default 1).
    """
    queryset = Product.objects.all().order_by('name')

    name = request.query_params.get('name', '').strip()
    if name:
        queryset = queryset.filter(name__icontains=name)

    min_price = request.query_params.get('min_price')
    if min_price is not None:
        try:
            queryset = queryset.filter(price__gte=Decimal(min_price))
        except (ValueError, TypeError):
            pass

    max_price = request.query_params.get('max_price')
    if max_price is not None:
        try:
            queryset = queryset.filter(price__lte=Decimal(max_price))
        except (ValueError, TypeError):
            pass

    try:
        page = max(1, int(request.query_params.get('page', 1)))
    except (ValueError, TypeError):
        page = 1

    count = queryset.count()
    total_pages = (count + PAGE_SIZE_PRODUCTS - 1) // PAGE_SIZE_PRODUCTS if count else 1
    page = min(page, total_pages)
    start = (page - 1) * PAGE_SIZE_PRODUCTS
    end = start + PAGE_SIZE_PRODUCTS
    products_page = queryset[start:end]
    serializer = ProductSerializer(products_page, many=True)

    return Response({
        'count': count,
        'total_pages': total_pages,
        'page': page,
        'next': page < total_pages,
        'previous': page > 1,
        'results': serializer.data,
    })


@api_view(['POST'])
def save_cart(request):
    """
    Recibe una lista de items del carrito, guarda el carrito en la base de datos
    y devuelve success con número de orden y lista de productos.
    Body esperado: { "items": [ { "id", "name", "price", "quantity" }, ... ] }
    """
    items = request.data.get('items', [])
    if not items:
        return Response(
            {'error': 'La lista de items no puede estar vacía'},
            status=status.HTTP_400_BAD_REQUEST,
        )
    order_number = f"ORD-{uuid.uuid4().hex[:8].upper()}"
    products = []
    total_price = Decimal('0')
    for item in items:
        quantity = int(item.get('quantity', 0))
        price = Decimal(str(item.get('price', '0')))
        products.append({
            'id': item.get('id'),
            'name': item.get('name', ''),
            'quantity': quantity,
            'price': str(price),
        })
        total_price += price * quantity
    cart = Cart.objects.create(products=products, total_price=total_price)
    return Response({
        'success': True,
        'order_number': order_number,
        'cart_id': cart.id,
        'products': products,
        'total_price': str(cart.total_price),
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
def cart_list(request):
    """
    Lista carritos con filtros y paginación.
    Query params: min_price, max_price, date_from (YYYY-MM-DD), date_to (YYYY-MM-DD), page (default 1).
    """
    queryset = Cart.objects.all().order_by('-created_at')

    min_price = request.query_params.get('min_price')
    if min_price is not None:
        try:
            queryset = queryset.filter(total_price__gte=Decimal(min_price))
        except (ValueError, TypeError):
            pass

    max_price = request.query_params.get('max_price')
    if max_price is not None:
        try:
            queryset = queryset.filter(total_price__lte=Decimal(max_price))
        except (ValueError, TypeError):
            pass

    date_from = request.query_params.get('date_from')
    if date_from:
        try:
            d = datetime.strptime(date_from, '%Y-%m-%d').date()
            queryset = queryset.filter(created_at__date__gte=d)
        except (ValueError, TypeError):
            pass

    date_to = request.query_params.get('date_to')
    if date_to:
        try:
            d = datetime.strptime(date_to, '%Y-%m-%d').date()
            queryset = queryset.filter(created_at__date__lte=d)
        except (ValueError, TypeError):
            pass

    try:
        page = max(1, int(request.query_params.get('page', 1)))
    except (ValueError, TypeError):
        page = 1

    count = queryset.count()
    total_pages = (count + PAGE_SIZE - 1) // PAGE_SIZE if count else 1
    page = min(page, total_pages)
    start = (page - 1) * PAGE_SIZE
    end = start + PAGE_SIZE
    carts_page = queryset[start:end]
    serializer = CartSerializer(carts_page, many=True)

    return Response({
        'count': count,
        'total_pages': total_pages,
        'page': page,
        'next': page < total_pages,
        'previous': page > 1,
        'results': serializer.data,
    })


@api_view(['GET', 'DELETE'])
def cart_detail(request, pk):
    """GET: devuelve un carrito. DELETE: elimina un carrito."""
    try:
        cart = Cart.objects.get(pk=pk)
    except Cart.DoesNotExist:
        return Response(
            {'error': 'Carrito no encontrado'},
            status=status.HTTP_404_NOT_FOUND,
        )
    if request.method == 'GET':
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    if request.method == 'DELETE':
        cart.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
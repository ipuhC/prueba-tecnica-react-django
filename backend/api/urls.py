from django.urls import path
from .views import product_list, save_cart, cart_list, cart_detail

urlpatterns = [
    path('products/', product_list, name='product-list'),
    path('save-cart/', save_cart, name='save-cart'),
    path('carts/', cart_list, name='cart-list'),
    path('carts/<int:pk>/', cart_detail, name='cart-detail'),
]
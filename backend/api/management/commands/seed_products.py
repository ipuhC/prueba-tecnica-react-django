from django.core.management.base import BaseCommand
from api.models import Product


class Command(BaseCommand):
    help = 'Crea productos de ejemplo en la base de datos'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Elimina todos los productos antes de crear nuevos',
        )

    def handle(self, *args, **options):
        if options['clear']:
            Product.objects.all().delete()
            self.stdout.write(
                self.style.WARNING('Todos los productos han sido eliminados.')
            )

        productos = [
            {
                'name': 'Laptop HP Pavilion',
                'description': 'Laptop de alta gama con procesador Intel Core i7, 16GB RAM y SSD de 512GB. Ideal para trabajo y gaming.',
                'price': 1299.99,
                'stock': 15
            },
            {
                'name': 'Mouse Logitech MX Master 3',
                'description': 'Mouse inalámbrico ergonómico con sensor de alta precisión. Perfecto para productividad.',
                'price': 99.99,
                'stock': 45
            },
            {
                'name': 'Teclado Mecánico Corsair K95',
                'description': 'Teclado mecánico RGB con switches Cherry MX. Ideal para gaming y escritura.',
                'price': 189.99,
                'stock': 30
            },
            {
                'name': 'Monitor LG UltraWide 34"',
                'description': 'Monitor curvo ultrawide de 34 pulgadas con resolución QHD y tecnología IPS.',
                'price': 599.99,
                'stock': 12
            },
            {
                'name': 'Auriculares Sony WH-1000XM5',
                'description': 'Auriculares inalámbricos con cancelación de ruido líder en la industria.',
                'price': 399.99,
                'stock': 25
            },
            {
                'name': 'Webcam Logitech C920',
                'description': 'Webcam Full HD 1080p con micrófono estéreo integrado. Perfecta para videollamadas.',
                'price': 79.99,
                'stock': 40
            },
            {
                'name': 'SSD Samsung 970 EVO 1TB',
                'description': 'Disco sólido NVMe M.2 de alta velocidad. Lee hasta 3,500 MB/s.',
                'price': 149.99,
                'stock': 35
            },
            {
                'name': 'Router TP-Link AX6000',
                'description': 'Router WiFi 6 de doble banda con velocidades de hasta 6 Gbps.',
                'price': 299.99,
                'stock': 18
            },
            {
                'name': 'Tablet iPad Air',
                'description': 'Tablet de 10.9 pulgadas con chip M1 y soporte para Apple Pencil.',
                'price': 649.99,
                'stock': 22
            },
            {
                'name': 'Smartphone Samsung Galaxy S23',
                'description': 'Smartphone de última generación con cámara de 50MP y pantalla AMOLED.',
                'price': 899.99,
                'stock': 28
            },
            {
                'name': 'Impresora HP LaserJet Pro',
                'description': 'Impresora láser monocromática con WiFi. Rápida y eficiente.',
                'price': 249.99,
                'stock': 10
            },
            {
                'name': 'Micrófono Blue Yeti',
                'description': 'Micrófono USB profesional con múltiples patrones de captación.',
                'price': 129.99,
                'stock': 32
            },
            {
                'name': 'Cámara Canon EOS R6',
                'description': 'Cámara mirrorless full-frame con sensor de 20MP y grabación 4K.',
                'price': 2499.99,
                'stock': 5
            },
            {
                'name': 'Smart Watch Apple Watch Series 9',
                'description': 'Reloj inteligente con pantalla siempre activa y seguimiento avanzado de salud.',
                'price': 429.99,
                'stock': 20
            },
            {
                'name': 'Disco Duro Externo WD 4TB',
                'description': 'Disco duro portátil USB 3.0 de 4TB. Ideal para backups.',
                'price': 109.99,
                'stock': 50
            },
            {
                'name': 'Hub USB-C Anker',
                'description': 'Hub 7 en 1 con HDMI, USB 3.0 y lector de tarjetas SD.',
                'price': 49.99,
                'stock': 60
            },
            {
                'name': 'Silla Gaming DXRacer',
                'description': 'Silla ergonómica para gaming con soporte lumbar ajustable.',
                'price': 349.99,
                'stock': 8
            },
            {
                'name': 'Lámpara LED de Escritorio',
                'description': 'Lámpara LED regulable con brazo articulado y carga USB.',
                'price': 39.99,
                'stock': 45
            },
            {
                'name': 'Mousepad XXL RGB',
                'description': 'Alfombrilla grande de escritorio con iluminación RGB personalizable.',
                'price': 29.99,
                'stock': 55
            },
            {
                'name': 'Cable USB-C a USB-C 2m',
                'description': 'Cable de carga rápida USB-C compatible con Power Delivery.',
                'price': 19.99,
                'stock': 100
            },
        ]

        productos_creados = 0
        for producto_data in productos:
            producto, created = Product.objects.get_or_create(
                name=producto_data['name'],
                defaults={
                    'description': producto_data['description'],
                    'price': producto_data['price'],
                    'stock': producto_data['stock'],
                }
            )
            if created:
                productos_creados += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Producto creado: {producto.name}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'○ Producto ya existe: {producto.name}')
                )

        self.stdout.write(
            self.style.SUCCESS(
                f'\n¡Seeder completado! {productos_creados} productos nuevos creados.'
            )
        )

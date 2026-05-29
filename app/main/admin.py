from django.contrib import admin
from .models import Category, Product

# Настройка панели администратора Django
# Здесь мы определяем, как будут отображаться и управляться наши модели в админке

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """
    Настройки админ-панели для модели Category.
    Автоматически генерирует URL-friendly slug на основе названия категории.
    """
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """
    Настройки админ-панели для модели Product.
    Определяет отображаемые колонки, фильтры сбоку и поля для поиска.
    """
    # Колонки, которые будут видны в списке товаров
    list_display = ['name', 'price', 'category', 'is_new', 'is_sale']
    
    # Боковая панель с фильтрами для быстрой сортировки
    list_filter = ['category', 'is_new', 'is_sale']
    
    # Поля, по которым будет работать текстовый поиск в админке
    search_fields = ['name', 'description']

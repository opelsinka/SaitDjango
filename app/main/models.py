from django.db import models

# Управление моделями, какими, я что-то не понял

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    old_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    is_new = models.BooleanField(default=False)
    is_sale = models.BooleanField(default=False)
    sizes = models.JSONField(default=dict)  # {"70B": 5, "75C": 3}
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    

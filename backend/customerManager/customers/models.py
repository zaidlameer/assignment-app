from django.db import models

class Customer(models.Model):
    TITLE_CHOICES = [
        ('Mr', 'Mr'),
        ('Mrs', 'Mrs'),
        ('Ms', 'Ms'),
        ('Dr', 'Dr'),
        # Add as needed
    ]

    CATEGORY_CHOICES = [
        ('Domestic', 'Domestic'),
        ('International', 'International'),
    ]

    title = models.CharField(max_length=5, choices=TITLE_CHOICES)
    customer_category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    address_1 = models.CharField(max_length=255)
    address_2 = models.CharField(max_length=255, blank=True, null=True)  # Optional
    city = models.CharField(max_length=100)
    mobile = models.CharField(max_length=20)
    phone = models.CharField(max_length=20, blank=True, null=True)  # Optional
    company_name = models.CharField(max_length=100, blank=True, null=True)  # Optional
    photo = models.ImageField(upload_to='customer_photos/', blank=True, null=True)  # Optional
    credit_limit = models.DecimalField(max_digits=10, decimal_places=2)
    credit_period = models.IntegerField(help_text="Credit period in days")
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.company_name if self.company_name else 'Individual'})"

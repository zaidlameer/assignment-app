from django.urls import path
from .views import CustomerListCreateView, CustomerDetailView, ProfileView
from django.contrib import admin

urlpatterns = [
    path('customers/', CustomerListCreateView.as_view(), name='customer-list-create'),
    path('customers/<int:pk>/', CustomerDetailView.as_view(), name='customer-detail'),
]

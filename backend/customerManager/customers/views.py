from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Customer
from .serializers import CustomerSerializer
from rest_framework.permissions import IsAuthenticated

class CustomerListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        group_city_map = {
            'Admin': None,  
            'HeadOffice': None,              
            'ColomboBranch': ['Colombo'],   
            'KandyBranch': ['Kandy'],       
            'GalleBranch': ['Galle'],
            'WattalaBranch': ['Wattala'],
            'JaffnaBranch':['Jaffna'],
            'NegomboBranch':['Negombo']
        }

        allowed_cities = []

        # Collect all cities for groups the user belongs to
        for group_name, cities in group_city_map.items():
            if user.groups.filter(name=group_name).exists():
                if cities is None:
                    # Admin sees all cities
                    allowed_cities = None
                    break
                allowed_cities.extend(cities if isinstance(cities, list) else [cities])

        # Remove duplicates just in case
        if allowed_cities is not None:
            allowed_cities = list(set(allowed_cities))

        # Query customers
        if allowed_cities is None:
            # Admin: return all customers
            customers = Customer.objects.filter(is_deleted=False)
        else:
            customers = Customer.objects.filter(city__in=allowed_cities, is_deleted=False)

        serializer = CustomerSerializer(customers, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomerDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Example logic: map groups to allowed cities
        group_city_map = {
            'Admin': None,    
            'HeadOffice': None,          # Admin sees all cities
            'ColomboTeam': 'Colombo',   # ColomboTeam sees only Colombo customers
            'KandyTeam': 'Kandy',       # KandyTeam sees only Kandy customers
            'WattalaTeam': 'Wattala',
            'GalleTeam':'Galle',
            'NegomboTeam':'Negombo',
            'JaffnaTeam':'Jaffna',  
        }

        allowed_city = None
        for group_name in group_city_map:
            if user.groups.filter(name=group_name).exists():
                allowed_city = group_city_map[group_name]
                break

        if allowed_city:
            customers = Customer.objects.filter(city=allowed_city, is_deleted=False)
        else:
            # Default: no city restriction (Admin or no group)
            customers = Customer.objects.filter(is_deleted=False)

        serializer = CustomerSerializer(customers, many=True)
        
        return Response(serializer.data)

    def put(self, request, pk):
        try:
            customer = Customer.objects.get(pk=pk, is_deleted=False)
        except Customer.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = CustomerSerializer(customer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            customer = Customer.objects.get(pk=pk, is_deleted=False)
        except Customer.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        customer.is_deleted = True  # soft delete
        customer.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "username": user.username,
        }, status=status.HTTP_200_OK)

from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny


# Create your views here.
#view to allow us implement creating a new user(REGISTRATION FORM)
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    #this line looks at the list of users existing to make sure user info is not recreated
    serializer_class = UserSerializer
    #tells the view which data to accept to make a new user
    permission_classes = [AllowAny]
    #allows anyone to access this view even though not authenticated to create a new user



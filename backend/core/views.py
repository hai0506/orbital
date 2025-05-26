from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *
from .serializers import *
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

# Create your views here.
class LoginView(APIView):
    def post(self, request):
        username = request.data["username"]
        password = request.data["password"]
        user = authenticate(request, username=username, password=password)

        if user is None:
            return Response({"message": "Invalid credentials"})
        else:
            login(request, user)
            return Response({"message": "Login successful"})

class LogoutView(APIView):
    def post(self,request):
        logout(request)
        return Response({"message": "Logged out"})

    
class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)   
        if serializer.is_valid():
            password = request.data['password']
            try:
                validate_password(password)
            except ValidationError as e:
                return Response({"message": "Password must be minimum 8 characters"})
            serializer.save()
            user = User.objects.get(username = request.data['username'])
            user.set_password(password)
            user.save()
            return Response(
                {"message": "Registration successful"})
        else:
            error_msg = ""
            for key in serializer.errors:
                error_msg += serializer.errors[key][0]
            return Response({"message": error_msg})
        
class HomeView(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            user = UserSerializer(request.user)
            return Response(user.data)
        else: 
            return Response({"message": "no one logged in rn"})


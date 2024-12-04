from rest_framework import serializers
from django.contrib.auth.models import User

#this serializer can be used to accept and return a new user
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password')
        #tells Django that it should accept the password when creating a new user
        #but its should not return the password when giving info about the user
        #WRITE_ONLY makes sure that noone reads what the password is
        extra_kwargs = {'password': {'write_only': True}}

        #this is a function implements the method to create a new user
        #the validated data is the fields in the serializers
        def create(self, validated_data):
            user = User.objects.create_user(**validated_data)
            #once the data has been validated in the first line the line above
            #will create the new user now
            return user
        
    

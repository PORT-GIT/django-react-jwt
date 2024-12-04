from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Note

#this serializer can be used to accept and return a new user
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password')
        #tells Django that it should accept the password when creating a new user
        #but its should not return the password when giving info about the user
        #WRITE_ONLY makes sure that noone reads what the password is
        extra_kwargs = {'password': {"write_only": True}}

    #this is a function implements the method to create a new user
    #the validated data is the fields in the serializers
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        #once the data has been validated in the first line the line above
        #will create the new user now
        return user
    

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ('id', 'title', 'content', 'created_at', 'author')
        #the READ_ONLY means that we should only read who is the author
        #but the author will be set based on whoever created the note meaning noone can write
        #and assign an author of their choosing
        #OR IN SHORT THE AUTHOR IS SET BY THE BACKEND AND NOT ANYONE ELSE
        extra_kwargs = {'author': {'read_only' : True}}  
        
    

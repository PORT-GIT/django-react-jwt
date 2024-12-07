from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note


# Create your views here.
#view to allow us implement creating a new user(REGISTRATION FORM)
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    #this line looks at the list of users existing to make sure user info is not recreated
    serializer_class = UserSerializer
    #tells the view which data to accept to make a new user
    permission_classes = [AllowAny]
    #allows anyone to access this view even though not authenticated to create a new user

#this view will list all the notes created by the user or create a note
class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    #this ensures that the user is autheticated before creating note
    permission_classes = [IsAuthenticated]

    #this a method
    #that has been used unlike the above view to get access to the REQUEST OBJECT below
    # which specifies the user so that i can filter the notes created by that user
    #ALSO I CANNOT VIEW THE NOTES WRITTEN BY SOMEONE ELSE ONLY MYSELF
    def get_queryset(self):
        #this will get a user that is authenticated and has the permission to interact with this view
        user = self.request.user
        #the authenticated user object is retrieved using the line above
        #the user is then used to filter the notes written by the retrieved user object
        return Note.objects.filter(author=user)
        #this will filter all the notes written by the called user

    #this is to customize the way we will create a note
    #IN SHORT OVERRIDING THE CREATE METHOD FOR A NOTE
    def perform_create(self, serializer):
        #this will pass the data through the serializer to check if its valid or not
        #according to the fields of the models to make sure it is accurate
        #IS_VALID MANUALLY CHECKS IF THE DATA IS VALID
        if serializer.is_valid():
            #if the data to create a new version of the note is valid the serializer saves the data
            #which will make a new version of the note
            #anything can be passed in the SAVE() but in this case i have added the author because in
            #the serializer i specified the author to be read-only
            #since the data cannot be passed automatically it has been manually added
            serializer.save(author = self.request.user)
        else:
            print(serializer.errors)


class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    #notes will only be deleted if user is authenticated
    permission_classes = [IsAuthenticated]

    #this is to get the notes of the authenticated user to delete them
    #these are the valid notes that can be deleted
    def get_queryset(self):
        #this will get a user that is authenticated and has the permission to interact with this delete view
        user = self.request.user
        #the authenticated user object is retrieved using the line above
        #the user is then used to filter the notes written by the retrieved user object
        return Note.objects.filter(author=user)
        #this will filter all the notes written by the authenticated user who can then delete them


            
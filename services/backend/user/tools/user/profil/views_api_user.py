from authentication.models import CustomUser
from .serializers import CustomUserSerializer
from rest_framework import viewsets
from rest_framework.response import Response


class CustomUserViewSet(viewsets.ModelViewSet):
	"""
	CustomUserViewSet description
	"""
	queryset = CustomUser.objects.all()
	serializer_class = CustomUserSerializer

	# overload the retrieve method to return the user's profile
	# def get_object(self):
	# return get_object_or_404(CustomUser, username=self.kwargs['pk'])

	def retrieve(self, request, *args, **kwargs):
		"""
		Retrieve method description
		"""
		instance = self.get_object()
		serializer = self.get_serializer(instance)
		return Response(serializer.data)

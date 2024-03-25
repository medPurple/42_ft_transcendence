from authentication.models import CustomUser
from .serializers import CustomUserSerializer
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated


class CustomUserViewSet(viewsets.ModelViewSet):
	"""
	CustomUserViewSet description
	"""
	queryset = CustomUser.objects.all()
	serializer_class = CustomUserSerializer

	# overload the retrieve method to return the user's profile
	# def get_object(self):
	# return get_object_or_404(CustomUser, username=self.kwargs['pk'])

	@action(detail=False, methods=['get'])
	def profile(self, request, *args, **kwargs):
		"""
		Retrieve method description
		"""
		instance = self.get_object()
		serializer = self.get_serializer(instance)
		return Response(serializer.data)


	@action(detail=False, methods=['post'])
	def edit_profile(self, request, *args, **kwargs):
		form = CustomProfileForm(request.data, instance=request.user)
		if form.is_valid():
			form.save()
			return Response({'success': True}, status=201)
		else:
			return Response(form.errors, status=400)

	@action(detail=False, methods=['post'])
	def delete_account(self, request, *args, **kwargs):
		user = request.user
		if not isinstance(user, AnonymousUser):
			try:
				user.delete()
			except CustomUser.DoesNotExist:
				return Response({'error': 'User not found'}, status=404)
			logout(request)
			return Response({'success': True}, status=200)
		else:
			return Response({'error': 'User not authenticated'}, status=401)


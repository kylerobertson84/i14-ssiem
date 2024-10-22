import logging
from .mixins import LoggingMixin
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User, Role, Employee, Permission, RolePermission
from .serializers import UserSerializer, RoleSerializer, EmployeeSerializer, PermissionSerializer, RolePermissionSerializer

logger = logging.getLogger('accounts')

class UserViewSet(LoggingMixin, viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=False, methods=['get'])
    def me(self, request):
        logger.debug(f"User retrieved their own info: {request.user.email}")
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class RoleViewSet(LoggingMixin, viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

class PermissionViewSet(viewsets.ModelViewSet):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer

class RolePermissionViewSet(viewsets.ModelViewSet):
    queryset = RolePermission.objects.all()
    serializer_class = RolePermissionSerializer
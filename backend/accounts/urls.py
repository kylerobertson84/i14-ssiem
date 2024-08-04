
from django.urls import path, include
# from .views import RegisterView, UserView
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, RoleViewSet, EmployeeViewSet, PermissionViewSet, RolePermissionViewSet
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'roles', RoleViewSet)
router.register(r'employees', EmployeeViewSet)
router.register(r'permissions', PermissionViewSet)
router.register(r'role-permissions', RolePermissionViewSet)

urlpatterns = [
    # path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('api/register/', RegisterView.as_view(), name='register'),
    # path('api/user/', UserView.as_view(), name='user'),
    path('', include(router.urls)),
]


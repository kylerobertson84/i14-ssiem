
from rest_framework.test import APITestCase
from accounts.models import Employee
from accounts.serializers import EmployeeSerializer

class EmployeeSerializerTests(APITestCase):

    def test_valid_employee_creation(self):
        data = {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john.doe@example.com'
        }
        serializer = EmployeeSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        employee = serializer.save()
        self.assertEqual(employee.first_name, data['first_name'])
        self.assertEqual(employee.last_name, data['last_name'])
        self.assertEqual(employee.email, data['email'])
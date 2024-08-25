
# accounts/tests/test_employee_model.py

from django.test import TestCase
from accounts.models import Employee

class EmployeeModelTest(TestCase):
    def test_create_employee(self):
        employee = Employee.objects.create(first_name="Jack", last_name="Bauer", email="jack.bauer@test.com")
        self.assertEqual(str(employee), "Jack Bauer")
        self.assertEqual(employee.email, "jack.bauer@test.com")

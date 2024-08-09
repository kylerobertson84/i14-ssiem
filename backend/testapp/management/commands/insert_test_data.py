
import random
from django.core.management.base import BaseCommand
from testapp.models import TestTable

class Command(BaseCommand):
    help = 'Inserts test data into the TestTable'

    def handle(self, *args, **kwargs):
        names = ['Alice', 'Bob', 'Charlie', 'David', 'Eve']
        for name in names:
            TestTable.objects.create(name=name, age=random.randint(20, 40))
        self.stdout.write(self.style.SUCCESS('Successfully inserted test data.'))


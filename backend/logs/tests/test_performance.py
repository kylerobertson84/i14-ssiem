import time
from django.test import TransactionTestCase
from django.urls import reverse
from django.db.models import Count
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import User, Role
from logs.models import BronzeEventData, RouterData
from django.db import connection, transaction
from django.utils import timezone
from django.core.management import call_command
from django.test.utils import override_settings

class PerformanceTests(TransactionTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.insert_test_data()

    @classmethod
    def insert_test_data(cls):
        print("Inserting test data...")
        start_time = time.time()
        
        current_time = timezone.now().strftime('%Y-%m-%d %H:%M:%S')
        num_rows = 1000000
        batch_size = 100000

        with transaction.atomic():
            with connection.cursor() as cursor:
                for i in range(0, num_rows, batch_size):
                    cursor.execute(f"""
                        INSERT INTO logs_bronzeeventdata (
                            hostname, EventType, EventID, AccountName, 
                            created_at, updated_at, processed
                        )
                        SELECT 
                            CONCAT('host', FLOOR(1 + (RAND() * 1000000))),
                            CASE WHEN RAND() < 0.5 THEN 'Login' ELSE 'Logout' END,
                            FLOOR(1000 + (RAND() * 9000)),
                            CONCAT('user', FLOOR(1 + (RAND() * 1000000))),
                            '{current_time}',
                            '{current_time}',
                            0
                        FROM 
                            (SELECT @row := @row + 1 AS row FROM 
                                (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) t1,
                                (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) t2,
                                (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) t3,
                                (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) t4,
                                (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) t5,
                                (SELECT @row:=0) r
                            ) nums
                        LIMIT {batch_size};
                    """)
                    print(f"Inserted batch {i // batch_size + 1} of {num_rows // batch_size}")

        end_time = time.time()
        print(f"Data insertion completed in {end_time - start_time:.2f} seconds")

        # Verify row count
        with connection.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM logs_bronzeeventdata;")
            row_count = cursor.fetchone()[0]
            print(f"Actual number of rows in database: {row_count}")
            assert row_count == num_rows, f"Expected {num_rows} rows, but found {row_count}"

    def setUp(self):
        self.client = APIClient()
        self.role = Role.objects.create(name='Admin')
        self.user = User.objects.create_user(email='test@example.com', password='password123', role=self.role)
        self.client.force_authenticate(user=self.user)

    @override_settings(DEBUG=False)  # Disable DEBUG to prevent SQL logging
    def test_query_performance(self):
        # Warm up the database
        self.client.get(reverse('bronzeeventdata-list'))

        # Measure query time
        start_time = time.time()
        response = self.client.get(reverse('bronzeeventdata-list'))
        end_time = time.time()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        query_time = end_time - start_time
        print(f"Query time on large dataset: {query_time:.2f} seconds")

        # Adjust this threshold based on your performance requirements
        self.assertLess(query_time, 1, "Query time should be less than 1 second")

    def test_system_responsiveness_during_ingestion(self):
        # Simulate log ingestion
        ingestion_start = time.time()
        BronzeEventData.objects.bulk_create([
            BronzeEventData(hostname=f'test{i}', EventType='Login', EventID='4624', AccountName=f'user{i}')
            for i in range(10000)  # Increased to 10,000 for more realistic load
        ])
        ingestion_time = time.time() - ingestion_start
        print(f"Ingestion time for 10,000 records: {ingestion_time:.2f} seconds")

        # Measure query time during ingestion
        query_start = time.time()
        response = self.client.get(reverse('bronzeeventdata-list'))
        query_time = time.time() - query_start

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        print(f"Query time during ingestion: {query_time:.2f} seconds")

        self.assertLess(query_time, 1, "Query time during ingestion should be less than 1 second")

    @override_settings(DEBUG=False)  # Disable DEBUG to prevent SQL logging
    def test_complex_query_performance(self):
        # Example of a more complex query
        start_time = time.time()
        result = BronzeEventData.objects.values('EventType').annotate(count=Count('id')).order_by('-count')[:5]
        query_time = time.time() - start_time

        print(f"Complex query time: {query_time:.2f} seconds")
        print("Top 5 event types:", list(result))

        self.assertLess(query_time, 2, "Complex query time should be less than 2 seconds")

    def tearDown(self):
        User.objects.all().delete()
        Role.objects.all().delete()

    @classmethod
    def tearDownClass(cls):
        # Clean up the test data
        BronzeEventData.objects.all().delete()
        RouterData.objects.all().delete()
        super().tearDownClass()
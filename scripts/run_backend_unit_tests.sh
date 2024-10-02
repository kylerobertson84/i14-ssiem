
docker-compose exec backend python manage.py test accounts.tests
docker-compose exec backend python manage.py test alerts.tests
docker-compose exec backend python manage.py test core.tests
docker-compose exec backend python manage.py test logs.tests
docker-compose exec backend python manage.py test reports.tests
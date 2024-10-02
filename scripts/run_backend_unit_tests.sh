
#!/bin/bash

printf "\e[35m======================================================\n\e[0m\n"
printf "\e[35mRunning unit tests for Accounts . . .\e[0m\n"
docker-compose exec backend python manage.py test accounts.tests

printf "\e[35m======================================================\n\e[0m\n"
printf "\e[35mRunning unit tests for Alerts . . .\e[0m\n"
docker-compose exec backend python manage.py test alerts.tests

printf "\e[35m======================================================\n\e[0m\n"
printf "\e[35mRunning unit tests for Core . . .\e[0m\n"
docker-compose exec backend python manage.py test core.tests

printf "\e[35m======================================================\n\e[0m\n"
printf "\e[35mRunning unit tests for Logs . . .\e[0m\n"
docker-compose exec backend python manage.py test logs.tests

printf "\e[35m======================================================\n\e[0m\n"
printf "\e[35mRunning unit tests for Reports . . .\e[0m\n"
docker-compose exec backend python manage.py test reports.tests

printf "\e[35m======================================================\n\e[0m\n"
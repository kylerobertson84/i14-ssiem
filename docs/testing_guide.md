
# Testing Guide

## Initial setup

1. Start a database shell with: 
```
docker exec -it i14-ssiem-db-1 /bin/bash
```
2. Log in to MariaDB as root user:
```
mysql -u root -p
password: random_password
```
3. Grant privileges to test database (it automatically creates a test database then destroys it after tests have run)
```
GRANT ALL PRIVILEGES ON test_siem_db.* TO 'siem_user'@'%';
FLUSH PRIVILEGES;
```
4. Exit out of the database shell as it's not needed now, then out of the database shell.
```
quit
exit
```
5. In the root of the i14-ssiem directory run the following script/s to run the test cases:
```
./scripts/test_accounts.sh 
```
6. If the script doesn't run to grant permissions:
```
chmod +x ./scripts/test_accounts.sh
```

## Run the Test Cases

1. To run the test cases: 
```
./scripts/test_accounts.sh 
```

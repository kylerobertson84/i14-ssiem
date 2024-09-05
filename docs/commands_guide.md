
# Command Line Reference / Guide

## Docker commands

## Django commands

### To create a super user
1. In the root directory of the project run:
```
docker-compose exec backend python manage.py createsuperuser
```
2. Set a username or email address (whichever prompts you)
3. Set a password and repeat it

## Maria DB commands

1. To access the database container run:
```
docker exec -it i14-ssiem-db-1 /bin/bash
```

2. To enter the database:
```
mysql -u siem_user -p
```
3. Password:
```
random_password
```
If `siem_user` lacks the permissions run:
```
GRANT ALL PRIVILEGES ON siem_db.* TO 'siem_user'@'%';
FLUSH PRIVILEGES;
```
Then repeat steps 2 and 3.

## React commands

## Temp commands to using while developing
```
insert into alerts_investigatealert (created_at, updated_at, status, notes, alert_id, assigned_to_id) values ('2024-09-04 08:54:11.809303','2024-09-04 08:54:11.809303','RESOVLED','some closed notes', 4, '2c7a9f32e3b94c2aa70741fca73ed142');
```


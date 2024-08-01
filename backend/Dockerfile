FROM python:3.9

WORKDIR /backend

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
CMD ["python", "manage.py", "runserver_plus", "--print-sql", "0.0.0.0:8000"]
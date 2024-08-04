FROM python:3.9
WORKDIR /backend
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .

# Copy the entrypoint script and set correct line endings
COPY entrypoint.sh /entrypoint.sh
RUN sed -i 's/\r$//g' /entrypoint.sh
RUN chmod +x /entrypoint.sh
RUN apt-get update && apt-get install -y netcat-openbsd

# Set the entrypoint
ENTRYPOINT ["/bin/sh", "/entrypoint.sh"]
CMD ["python", "manage.py", "runserver_plus", "--print-sql", "0.0.0.0:8000"]
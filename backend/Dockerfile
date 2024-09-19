FROM python:3.12

WORKDIR /backend

RUN apt-get update && apt-get install -y netcat-openbsd

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

# Copy and prepare the entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN sed -i 's/\r$//g' /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Set the entrypoint
ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 8000


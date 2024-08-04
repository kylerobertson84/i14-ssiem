from django.http import JsonResponse
from django.db import connection

def health_check(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            one = cursor.fetchone()[0]
            if one != 1:
                raise Exception("Database check failed")
        return JsonResponse({"status": "healthy", "database": "connected"})
    except Exception as e:
        return JsonResponse({"status": "unhealthy", "database": "disconnected", "error": str(e)}, status=500)
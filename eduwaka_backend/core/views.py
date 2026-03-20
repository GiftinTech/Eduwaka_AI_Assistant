from django.http import JsonResponse
from django.db import connection


def health_check(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1;")
            cursor.fetchone()

        return JsonResponse({"status": "ok"})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)
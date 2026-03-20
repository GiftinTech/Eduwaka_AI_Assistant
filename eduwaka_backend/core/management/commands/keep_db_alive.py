from django.core.management.base import BaseCommand
from django.db import connection
from datetime import datetime


class Command(BaseCommand):
    help = "Keeps Supabase PostgreSQL database alive"

    def handle(self, *args, **kwargs):
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1;")
                result = cursor.fetchone()

            self.stdout.write(
                self.style.SUCCESS(
                    f"DB ping successful at {datetime.now()} → {result}"
                )
            )
        except Exception as e:
            self.stderr.write(
                self.style.ERROR(f"DB ping failed: {str(e)}")
            )
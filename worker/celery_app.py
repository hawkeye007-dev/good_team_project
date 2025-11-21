"""
Celery Application Configuration

This module configures the Celery instance that connects to Redis
for the task queue.

TODO: Students should implement:
1. Import Celery from celery package
2. Configure Redis as broker and result backend
3. Set timezone and task settings
4. Enable task tracking
5. Configure retry policies
"""

# TODO: Uncomment and implement
# from celery import Celery
# import os
# from dotenv import load_dotenv

# load_dotenv()

# TODO: Create Celery instance
# app = Celery('reading_list_worker')

# TODO: Configure Celery
# app.conf.update(
#     broker_url=os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0'),
#     result_backend=os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0'),
#     task_serializer='json',
#     accept_content=['json'],
#     result_serializer='json',
#     timezone='UTC',
#     enable_utc=True,
#     task_track_started=True,
#     task_time_limit=30 * 60,  # 30 minutes hard limit
#     task_soft_time_limit=25 * 60,  # 25 minutes soft limit
# )

# TODO: Auto-discover tasks from tasks.py
# app.autodiscover_tasks(['tasks'])

# @app.task(bind=True)
# def debug_task(self):
#     print(f'Request: {self.request!r}')

print("Celery app configuration - implement the configuration above")

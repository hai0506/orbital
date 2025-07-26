FROM python:3.11-slim

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

WORKDIR /app/backend

COPY requirements.txt /app/backend/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/backend/

CMD ["gunicorn", "backend.asgi:application", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000", "--workers=3"]
# CMD ["uvicorn", "backend.asgi:application", "--host", "0.0.0.0", "--port", "8000"]
FROM python:3.9.18-alpine3.18

RUN apk add build-base postgresql-dev gcc python3-dev musl-dev

WORKDIR /app

COPY app/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app/ .

ENV PYTHONPATH=/app

# Change this to use the module name
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "__init__:app"]
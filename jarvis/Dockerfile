FROM python:3.8-slim

WORKDIR /app
COPY . /app


RUN  pip install --no-cache-dir -r requirements.txt

EXPOSE 6000


CMD ["python", "etl_handler.py","--host=0.0.0.0","port=6000"]

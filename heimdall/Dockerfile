FROM python:3.8-slim

WORKDIR /app
COPY . /app


RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 7000

CMD ["python", "heimdall_handler.py","--host=0.0.0.0","port=7000"]


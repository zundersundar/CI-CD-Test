from app import create_app

app = create_app()

if __name__ == '__main__':
    print("Starting application on port 8000")
    app.run(host="0.0.0.0", port=8000)
    print("Application started")

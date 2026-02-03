# Build Stage for Frontend
FROM node:18-alpine as frontend_build
WORKDIR /app/webapp
COPY webapp/package.json webapp/package-lock.json ./
RUN npm install
COPY webapp/ ./
RUN npm run build

# Runtime Stage for Python Bot
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies if needed (e.g. for psycopg2)
# RUN apt-get update && apt-get install -y libpq-dev gcc

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
# Copy built frontend assets
COPY --from=frontend_build /app/webapp/dist /app/webapp/dist

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Run the unified entry point
CMD ["python", "entry.py"]

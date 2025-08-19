# Use Ruby 3.3 as the base image
FROM ruby:3.3-slim

# Install system dependencies
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    postgresql-client \
    nodejs \
    npm && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Gemfile and Gemfile.lock
COPY Gemfile Gemfile.lock ./

# Install gems
RUN bundle install

# Copy the rest of the application
COPY . .

# Expose port 3000 (Rails default)
EXPOSE 3000

# Create a script to handle database setup and server start
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
# Wait for database to be ready\n\
until pg_isready -h ${DATABASE_HOST:-localhost} -p ${DATABASE_PORT:-5432} -U ${DATABASE_USERNAME:-postgres}; do\n\
  echo "Waiting for database..."\n\
  sleep 2\n\
done\n\
\n\
# Run database migrations\n\
bundle exec rails db:create db:migrate\n\
\n\
# Start the Rails server\n\
bundle exec rails server -b 0.0.0.0 -p 3000\n\
' > /app/start.sh && chmod +x /app/start.sh

# Start the Rails server
CMD ["/app/start.sh"]

# Task Management API - Rails Backend

A Ruby on Rails API for managing tasks and comments, converted from Java Spring Boot.

## Features

- **Tasks Management**: Create, read, update, and delete tasks with soft deletion
- **Comments System**: Add comments to tasks with full CRUD operations
- **RESTful API**: Clean API endpoints following REST conventions
- **PostgreSQL Database**: Robust database with proper indexing
- **CORS Support**: Configured for frontend integration
- **Docker Support**: Containerized for easy deployment

## Prerequisites

- Ruby 3.1.0 or higher
- PostgreSQL 12 or higher
- Bundler gem
- Docker (optional, for containerized setup)

## Installation

### Local Development Setup

1. **Clone the repository**
   ```bash
   cd /path/to/task_management/rails_backend
   ```

2. **Install dependencies**
   ```bash
   bundle install
   ```

3. **Configure database**
   
   Ensure PostgreSQL is running and create the database:
   ```bash
   # Create database user (if not exists)
   sudo -u postgres createuser -s postgres
   
   # Set password for postgres user
   sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"
   
   # Create databases
   bundle exec rails db:create
   ```

4. **Run database migrations**
   ```bash
   bundle exec rails db:migrate
   ```

5. **Start the server**
   ```bash
   bundle exec rails server -p 3000
   ```

   The API will be available at `http://localhost:3000`

### Docker Setup

1. **Build the Docker image**
   ```bash
   docker build -t task-management-rails .
   ```

2. **Run with Docker Compose** (assuming you have a docker-compose.yml)
   ```bash
   docker run -p 3000:3000 \
     -e DATABASE_HOST=host.docker.internal \
     -e DATABASE_NAME=taskdb \
     -e DATABASE_USERNAME=postgres \
     -e DATABASE_PASSWORD=postgres \
     task-management-rails
   ```

## API Endpoints

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/:id` | Get a specific task |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task (soft delete) |

### Comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks/:task_id/comments` | Get all comments for a task |
| POST | `/api/tasks/:task_id/comments` | Create a new comment |
| GET | `/api/comments/:id` | Get a specific comment |
| PUT | `/api/comments/:id` | Update a comment |
| DELETE | `/api/comments/:id` | Delete a comment |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | API health status |

## API Usage Examples

### Create a Task

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "task": {
      "number": "TASK-001",
      "title": "Complete project setup",
      "status": "initiated",
      "priority": "High",
      "assignee": "john.doe@example.com",
      "description": "Set up the initial project structure",
      "due_date": "2024-12-31T23:59:59Z"
    }
  }'
```

### Get All Tasks

```bash
curl http://localhost:3000/api/tasks
```

### Add a Comment to a Task

```bash
curl -X POST http://localhost:3000/api/tasks/1/comments \
  -H "Content-Type: application/json" \
  -d '{
    "comment": {
      "user_name": "Jane Smith",
      "comment": "This task looks good to go!"
    }
  }'
```

## Database Schema

### Task Items (`task_items`)

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT |
| number | VARCHAR(50) | UNIQUE, NOT NULL |
| title | VARCHAR(255) | NOT NULL |
| status | VARCHAR(50) | NOT NULL |
| priority | VARCHAR(50) | NOT NULL |
| assignee | VARCHAR(255) | NULL |
| description | TEXT | NULL |
| description_rich_text | TEXT | NULL |
| due_date | TIMESTAMP | NULL |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |
| deleted_at | TIMESTAMP | NULL (for soft delete) |

### Task Comments (`task_comments`)

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT |
| user_name | VARCHAR(255) | NOT NULL |
| comment | TEXT | NOT NULL |
| task_item_id | BIGINT | FOREIGN KEY, NOT NULL |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

## Configuration

### Environment Variables

- `DATABASE_HOST`: PostgreSQL host (default: localhost)
- `DATABASE_PORT`: PostgreSQL port (default: 5432)
- `DATABASE_NAME`: Database name (default: taskdb)
- `DATABASE_USERNAME`: Database username (default: postgres)
- `DATABASE_PASSWORD`: Database password
- `RAILS_ENV`: Rails environment (development, test, production)

### CORS Configuration

The API is configured to allow cross-origin requests from `http://localhost:3001`. Update `config/initializers/cors.rb` to modify allowed origins.

## Testing

Run the test suite:

```bash
# Run all tests
bundle exec rspec

# Run specific test file
bundle exec rspec spec/controllers/tasks_controller_spec.rb
```

## Key Differences from Java Spring Boot

1. **Soft Deletion**: Uses the `paranoia` gem instead of `@SQLDelete` annotations
2. **Validations**: ActiveRecord validations instead of Bean Validation annotations
3. **JSON Serialization**: Custom `as_json` methods instead of `@JsonIgnore`
4. **Controllers**: Rails controllers with before_action filters instead of Spring annotations
5. **Database**: ActiveRecord migrations instead of SQL schema files
6. **Dependencies**: Gemfile instead of pom.xml

## Development

### Adding New Features

1. Generate new models: `bundle exec rails generate model ModelName`
2. Generate new controllers: `bundle exec rails generate controller ControllerName`
3. Create migrations: `bundle exec rails generate migration AddFieldToModel field:type`

### Code Style

The project follows standard Rails conventions and practices.

## Production Deployment

For production deployment:

1. Set `RAILS_ENV=production`
2. Configure production database settings
3. Run `bundle exec rails assets:precompile` if using assets
4. Use a production-ready web server like Puma or Unicorn
5. Set up proper logging and monitoring

## License

This project is licensed under the MIT License.

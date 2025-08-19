class ApplicationController < ActionController::API
  # Health check endpoint
  def health
    render json: { status: 'OK', timestamp: Time.current }
  end
  
  protected
  
  # Handle record not found errors
  def handle_record_not_found
    render json: { error: 'Record not found' }, status: :not_found
  end
  
  # Handle validation errors
  def handle_validation_errors(record)
    render json: { errors: record.errors.full_messages }, status: :unprocessable_entity
  end
end

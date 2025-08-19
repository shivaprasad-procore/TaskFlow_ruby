class TasksController < ApplicationController
  before_action :set_task, only: [:show, :update, :destroy]

  # GET /api/tasks
  def index
    @tasks = Task.kept  # Only show non-deleted tasks
    render json: @tasks
  end

  # GET /api/tasks/:id
  def show
    if @task
      render json: @task
    else
      handle_record_not_found
    end
  end

  # POST /api/tasks
  def create
    @task = Task.new(task_params)

    if @task.save
      render json: @task, status: :created
    else
      handle_validation_errors(@task)
    end
  end

  # PUT /api/tasks/:id
  def update
    if @task
      if @task.update(task_params)
        render json: @task
      else
        handle_validation_errors(@task)
      end
    else
      handle_record_not_found
    end
  end

  # DELETE /api/tasks/:id (soft delete using Discard)
  def destroy
    if @task
      @task.discard  # This will set deleted_at timestamp (soft delete)
      head :ok
    else
      handle_record_not_found
    end
  end

  private

  def set_task
    @task = Task.kept.find_by(id: params[:id])  # Only find non-deleted tasks
  end

  def task_params
    params.require(:task).permit(
      :number, :title, :status, :priority, :assignee, 
      :description, :description_rich_text, :due_date
    )
  end
end

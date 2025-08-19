class CommentsController < ApplicationController
  before_action :set_task, only: [:index, :create]
  before_action :set_comment, only: [:show, :update, :destroy]

  # GET /api/tasks/:task_id/comments
  def index
    if @task
      @comments = @task.comments
      render json: @comments
    else
      handle_record_not_found
    end
  end

  # GET /api/comments/:id
  def show
    if @comment
      render json: @comment
    else
      handle_record_not_found
    end
  end

  # POST /api/tasks/:task_id/comments
  def create
    if @task
      # Transform parameters to match Rails model
      transformed_params = {
        user_name: comment_params[:userName] || comment_params[:user_name],
        comment: comment_params[:comment]
      }
      
      @comment = @task.comments.build(transformed_params)
      
      if @comment.save
        render json: @comment, status: :created
      else
        handle_validation_errors(@comment)
      end
    else
      handle_record_not_found
    end
  end

  # PUT /api/comments/:id
  def update
    if @comment
      if @comment.update(comment_params)
        render json: @comment
      else
        handle_validation_errors(@comment)
      end
    else
      handle_record_not_found
    end
  end

  # DELETE /api/comments/:id
  def destroy
    if @comment
      @comment.destroy
      head :ok
    else
      handle_record_not_found
    end
  end

  private

  def set_task
    @task = Task.find_by(id: params[:task_id])
  end

  def set_comment
    @comment = Comment.find_by(id: params[:id])
  end

  def comment_params
    params.require(:comment).permit(:user_name, :userName, :comment)
  end
end

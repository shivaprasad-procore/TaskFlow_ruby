class Comment < ApplicationRecord
  # Associations
  belongs_to :task, class_name: 'Task', foreign_key: 'task_item_id'
  
  # Validations
  validates :comment, presence: true
  validates :user_name, presence: true, length: { maximum: 255 }
  validates :task, presence: true
  
  # Table name to match your database schema
  self.table_name = 'task_comments'
  
  # Custom JSON serialization to exclude updated_at (similar to @JsonIgnore)
  def as_json(options = {})
    super(options.merge(except: [:updated_at]))
  end
  
  # Callbacks for timestamps (Rails handles this automatically, but showing for clarity)
  before_create :set_timestamps
  before_update :update_timestamp
  
  private
  
  def set_timestamps
    self.created_at = Time.current
    self.updated_at = Time.current
  end
  
  def update_timestamp
    self.updated_at = Time.current
  end
end

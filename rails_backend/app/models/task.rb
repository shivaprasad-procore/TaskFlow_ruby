class Task < ApplicationRecord
  # Use Discard for soft delete functionality (similar to @SQLDelete in Java)
  include Discard::Model
  self.discard_column = :deleted_at
  
  # Associations
  has_many :comments, dependent: :destroy, foreign_key: 'task_item_id'
  
  # Validations
  validates :number, presence: true, uniqueness: true, length: { maximum: 50 }
  validates :title, presence: true
  validates :status, presence: true, length: { maximum: 50 }
  validates :priority, presence: true, length: { maximum: 50 }
  validates :assignee, length: { maximum: 255 }, allow_blank: true
  
  # Status and priority constants - accept common frontend formats
  STATUSES = ['Initiated', 'In Progress', 'Completed', 'Done', 'initiated', 'in_progress', 'completed', 'done', 'In_Progress'].freeze
  PRIORITIES = ['High', 'Medium', 'Low', 'high', 'medium', 'low'].freeze
  
  validates :status, inclusion: { in: STATUSES }
  validates :priority, inclusion: { in: PRIORITIES }
  
  # Table name to match your database schema
  self.table_name = 'task_items'
  
  # Custom JSON serialization to exclude updated_at and deleted_at (similar to @JsonIgnore)
  def as_json(options = {})
    super(options.merge(except: [:updated_at, :deleted_at]))
  end
  
  # Scope for non-deleted tasks (Discard handles this automatically as 'kept')
  scope :active, -> { kept }
  
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

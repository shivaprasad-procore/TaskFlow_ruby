class CreateTaskItems < ActiveRecord::Migration[7.0]
  def change
    create_table :task_items, id: :serial do |t|
      t.string :number, null: false, limit: 50
      t.string :title, null: false
      t.string :status, null: false, limit: 50
      t.string :priority, null: false, limit: 50
      t.string :assignee, limit: 255
      t.text :description
      t.text :description_rich_text
      t.timestamp :due_date
      t.timestamps null: false
      t.timestamp :deleted_at, null: true
    end

    # Add indexes for performance and uniqueness
    add_index :task_items, :number, unique: true, where: "deleted_at IS NULL", 
              name: "unique_task_number_when_not_deleted"
    add_index :task_items, :number, where: "deleted_at IS NOT NULL", 
              name: "idx_task_number_when_deleted"
    add_index :task_items, :status, name: "idx_task_status"
    add_index :task_items, :priority, name: "idx_task_priority"
    add_index :task_items, :deleted_at, name: "idx_task_deleted_at"
  end
end

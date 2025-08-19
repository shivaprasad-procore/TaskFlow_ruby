class CreateTaskComments < ActiveRecord::Migration[7.0]
  def change
    create_table :task_comments do |t|
      t.string :user_name, null: false
      t.text :comment, null: false
      t.references :task_item, null: false, foreign_key: true
      t.timestamps null: false
    end

    # Add index for performance
    add_index :task_comments, :task_item_id, name: "idx_task_item_id"
  end
end

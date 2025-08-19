# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2025_08_19_061500) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "task_comments", force: :cascade do |t|
    t.text "comment", null: false
    t.timestamptz "created_at", null: false
    t.timestamptz "updated_at", null: false
    t.string "user_name", limit: 255
    t.bigint "task_item_id", null: false
  end

  create_table "task_items", force: :cascade do |t|
    t.string "assignee", limit: 255
    t.timestamptz "created_at", null: false
    t.timestamptz "deleted_at"
    t.text "description"
    t.text "description_rich_text"
    t.timestamptz "due_date"
    t.string "number", limit: 50, null: false
    t.string "priority", limit: 50, null: false
    t.string "status", limit: 50, null: false
    t.string "title", limit: 255, null: false
    t.timestamptz "updated_at", null: false

    t.unique_constraint ["number"], name: "ukl9bxee2v7f9y0n22ttqfoy5l6"
  end

  add_foreign_key "task_comments", "task_items", name: "fkck3lkoe7uv7jymel76gjulvrg"
end

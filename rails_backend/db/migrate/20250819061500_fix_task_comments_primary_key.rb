class FixTaskCommentsPrimaryKey < ActiveRecord::Migration[7.1]
  disable_ddl_transaction!

  def up
    # Ensure sequence exists
    execute <<~SQL
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_class c
          JOIN pg_namespace n ON n.oid = c.relnamespace
          WHERE c.relkind = 'S' AND c.relname = 'task_comments_id_seq'
        ) THEN
          CREATE SEQUENCE task_comments_id_seq;
        END IF;
      END
      $$;
    SQL

    # Ensure the id column uses the sequence by default
    execute "ALTER TABLE task_comments ALTER COLUMN id SET DEFAULT nextval('task_comments_id_seq');"

    # Backfill any existing rows that have NULL ids
    execute <<~SQL
      UPDATE task_comments
      SET id = nextval('task_comments_id_seq')
      WHERE id IS NULL;
    SQL

    # Align sequence with current max(id); never set below 1
    execute <<~SQL
      SELECT setval(
        'task_comments_id_seq',
        COALESCE((SELECT MAX(id) FROM task_comments), 1),
        true
      );
    SQL

    # Add primary key if it doesn't already exist
    execute <<~SQL
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'task_comments_pkey'
        ) THEN
          ALTER TABLE task_comments ADD CONSTRAINT task_comments_pkey PRIMARY KEY (id);
        END IF;
      END
      $$;
    SQL
  end

  def down
    execute "ALTER TABLE task_comments DROP CONSTRAINT IF EXISTS task_comments_pkey;"
    execute "ALTER TABLE task_comments ALTER COLUMN id DROP DEFAULT;"
    execute "DROP SEQUENCE IF EXISTS task_comments_id_seq;"
  end
end



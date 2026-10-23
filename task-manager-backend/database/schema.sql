CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  user_name VARCHAR(255) NOT NULL,
  email VARCHAR(320) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  otp_code VARCHAR(6),
  otp_expires TIMESTAMPTZ,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  category_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  color VARCHAR(7) NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
  task_id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  priority VARCHAR(10) NOT NULL DEFAULT 'medium',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  done_at TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(category_id) ON DELETE SET NULL
);

ALTER TABLE tasks
  ADD COLUMN IF NOT EXISTS priority VARCHAR(10) NOT NULL DEFAULT 'medium';

ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS color VARCHAR(7);

INSERT INTO categories (name, color)
SELECT seed.name, seed.color
FROM (
  VALUES
    ('Work', '#8FB486'),
    ('Study', '#E8B85C'),
    ('Personal', '#A99BD5'),
    ('Shopping', '#E88970'),
    ('Health', '#D98B8B'),
    ('Home', '#8FAFC4')
) AS seed(name, color)
WHERE NOT EXISTS (
  SELECT 1
  FROM categories existing
  WHERE existing.name = seed.name
);

UPDATE categories AS existing
SET color = seed.color
FROM (
  VALUES
    ('Work', '#8FB486'),
    ('Study', '#E8B85C'),
    ('Personal', '#A99BD5'),
    ('Shopping', '#E88970'),
    ('Health', '#D98B8B'),
    ('Home', '#8FAFC4')
) AS seed(name, color)
WHERE existing.name = seed.name
  AND existing.color IS NULL;

CREATE INDEX IF NOT EXISTS tasks_user_id_due_date_idx
  ON tasks (user_id, due_date);
